import React, { useState, useCallback, useContext } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { ScrollView, View, Platform, StyleSheet, InteractionManager, TouchableOpacity } from 'react-native'
import { TextInput, Text, useTheme, Button } from "react-native-paper"
import Loader from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { handleSignup } from '../functions/auth'
import Header from '../components/Header'
import { LayoutContext } from '../context/LayoutContext'

const Signup = () => {

    const navigation = useNavigation()
    const { dispatch: authDispatch } = useContext(AuthContext)
    const { state: layoutState } = useContext(LayoutContext)
    const { colors } = useTheme()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isEmailError, setIsEmailError] = useState(false)
    const [isPassError, setIsPassError] = useState(false)
    const [isConfirmPassError, setIsConfirmPassError] = useState(false)
    const [emailErrorMsg, setIsEmailErrorMsg] = useState('')
    const [passErrorMsg, setPassErrorMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)

    const signup = () => {
        if (email.trim() === '') {
            setIsEmailError(true)
            setIsEmailErrorMsg("Email can't be empty")
        } else if (password.trim().length < 6) {
            setIsPassError(true)
            setPassErrorMsg("Password must be 6 charecter long")
        } else if (password !== confirmPassword) {
            setIsConfirmPassError(true)
            setPassErrorMsg("Please re-type password")
        } else {
            handleSignup({ email, password },
                { authDispatch, setIsLoading },
                { setEmail, setPassword, setConfirmPassword },
                { setIsEmailError, setIsPassError },
                { setIsEmailErrorMsg, setPassErrorMsg },
                navigation)
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
                <Header title={layoutState.isEnglish ? layoutState.EN.SIGN_UP : layoutState.FR.SIGN_UP} />
            }
            <ScrollView style={styles.div_1} keyboardDismissMode='none'>
                <TextInput
                    label={`${layoutState.isEnglish ? layoutState.EN.EMAIL : layoutState.FR.EMAIL}`}
                    error={isEmailError}
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={text => {
                        setIsEmailError(false)
                        setIsEmailErrorMsg('')
                        setIsPassError(false)
                        setPassErrorMsg('')
                        setIsConfirmPassError(false)
                        setEmail(text)
                    }}
                    activeUnderlineColor="#f59e0b"
                    style={{ backgroundColor: colors.primary, paddingHorizontal: 0 }}
                />
                {isEmailError && <Text style={{ color: colors.error, fontWeight: "600" }}>
                    {emailErrorMsg}
                </Text>}
                <TextInput
                    label={`${layoutState.isEnglish ? layoutState.EN.PASSWORD : layoutState.FR.PASSWORD}`}
                    error={isPassError}
                    value={password}
                    secureTextEntry={true}
                    onChangeText={text => {
                        setIsEmailError(false)
                        setIsEmailErrorMsg('')
                        setIsPassError(false)
                        setPassErrorMsg('')
                        setIsConfirmPassError(false)
                        setPassword(text)
                    }}
                    activeUnderlineColor="#f59e0b"
                    style={{ marginTop: 10, backgroundColor: colors.primary, paddingHorizontal: 0 }}
                />
                {isPassError && <Text style={{ color: colors.error, fontWeight: "600" }}>
                    {passErrorMsg}
                </Text>}
                <TextInput
                    label={`${layoutState.isEnglish ? layoutState.EN.PASSWORD_CONFIRM : layoutState.FR.PASSWORD_CONFIRM}`}
                    error={isConfirmPassError}
                    value={confirmPassword}
                    secureTextEntry={true}
                    onChangeText={text => {
                        setIsEmailError(false)
                        setIsEmailErrorMsg('')
                        setIsPassError(false)
                        setPassErrorMsg('')
                        setIsConfirmPassError(false)
                        setConfirmPassword(text)
                    }}
                    activeUnderlineColor="#f59e0b"
                    style={{ marginTop: 10, backgroundColor: colors.primary, paddingHorizontal: 0 }}
                />
                {isConfirmPassError && <Text style={{ color: colors.error, fontWeight: "600" }}>
                    {passErrorMsg}
                </Text>}
                <Button mode="contained"
                    loading={isLoading}
                    color={colors.button}
                    style={{ marginTop: 20 }}
                    onPress={signup}>
                    {layoutState.isEnglish ? layoutState.EN.SIGN_UP : layoutState.FR.SIGN_UP}
                </Button>
                <TouchableOpacity style={styles.div_1}
                    onPress={() => navigation.navigate("Stack", { screen: "Privecy Policy" })}
                >
                    <Text style={{ marginTop: 30, color: colors.myOwnColor, textAlign: "center" }}>
                        {layoutState.isEnglish ? layoutState.EN.privacyPolicy : layoutState.FR.privacyPolicy}
                    </Text>
                </TouchableOpacity>
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

export default Signup