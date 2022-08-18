import React, { useState, useCallback, useContext } from 'react'
import { useFocusEffect } from "@react-navigation/native"
import { View, Platform, ScrollView, StyleSheet, InteractionManager } from 'react-native'
import { useTheme, HelperText, Button, TextInput } from "react-native-paper"
import Loader from '../components/Loader'
import { forgotPassword } from '../functions/auth'
import Header from '../components/Header'
import { LayoutContext } from '../context/LayoutContext'

const ForgotPass = () => {

    const { colors } = useTheme()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(null)
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)
    const [isLoading, setisLoading] = useState(false)
    const [emailMessage, sendEmailSuccess] = useState(null)
    const { state: layoutState } = useContext(LayoutContext)

    const resetUserPass = () => {
        if (email.trim() === '') {
            setEmailError("Email can't be empty")
        } else {
            forgotPassword(email, setisLoading, sendEmailSuccess)
        }
    }

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                setDidFinishInitialAnimation(true)
            });

            return () => task.cancel();
        }, [])
    )

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={{ flex: 1 }}>
            {Platform.OS === "ios" &&
                <Header title={layoutState.isEnglish ? layoutState.EN.FORGOT_PASSWORD : layoutState.FR.FORGOT_PASSWORD} />
            }
            <ScrollView style={styles.div_1}>
                <TextInput
                    label={`${layoutState.isEnglish ? layoutState.EN.EMAIL : layoutState.FR.EMAIL}`}
                    value={email}
                    error={emailError ? true : false}
                    onChangeText={text => setEmail(text)}
                    activeUnderlineColor="#f59e0b"
                    style={{ backgroundColor: colors.primary, paddingHorizontal: 0 }}
                />
                {emailError &&
                    <HelperText type="error" visible={true}>
                        {emailError}
                    </HelperText>
                }
                {emailMessage &&
                    <HelperText type="success" visible={true}>
                        {emailMessage}
                    </HelperText>
                }
                <Button mode="contained"
                    onPress={resetUserPass}
                    loading={isLoading}
                    color={colors.button}
                    style={{ marginTop: 20 }}>
                    {layoutState.isEnglish ? layoutState.EN.RESET_PASSWORD : layoutState.FR.RESET_PASSWORD}
                </Button>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    div_1: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff"
    }
})

export default ForgotPass