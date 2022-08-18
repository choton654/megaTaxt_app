import React, { useState, useContext, useCallback } from 'react'
import { ScrollView, View, InteractionManager, Platform } from 'react-native'
import { TextInput, Text, Button, useTheme, HelperText } from "react-native-paper"
import Loader from '../components/Loader'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { updateUser } from '../functions/auth'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'
import { LayoutContext } from '../context/LayoutContext'

const GetName = () => {

    const navigation = useNavigation()
    const { colors } = useTheme()
    const { dispatch: authDispatch } = useContext(AuthContext)
    const { state: layoutState } = useContext(LayoutContext)
    const [displayName, setDisplayName] = useState('')
    const [displayNameError, setDisplayNameError] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)

    const updateDisplayName = async () => {
        if (displayName.trim() === '') {
            setDisplayNameError("Display name can't be empty")
        } else if (displayName.trim() < 3) {
            setDisplayNameError("Display name too sort")
        } else {
            updateUser(displayName, setisLoading, navigation, authDispatch)
        }
    }

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(async () => {
                setDidFinishInitialAnimation(true)
            })
            return () => task.cancel()
        }, []))

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={{
            flex: 1,
            backgroundColor: "#fff"
        }}  >
            {Platform.OS === "ios" && <Header title={layoutState.isEnglish ? layoutState.EN.USER_SET_UP : layoutState.FR.USER_SET_UP} />}
            <ScrollView contentContainerStyle={{ padding: 20 }}
                keyboardDismissMode='none'>
                <Text style={{ textAlign: "center", fontWeight: "700", fontSize: 20 }}>
                    {layoutState.isEnglish ? layoutState.EN.YOUR_NAME : layoutState.FR.YOUR_NAME}
                </Text>
                <TextInput
                    label="Name"
                    value={displayName}
                    error={displayNameError ? true : false}
                    onChangeText={text => {
                        setDisplayName(text)
                        setDisplayNameError(null)
                    }}
                    activeUnderlineColor="#f59e0b"
                    style={{ backgroundColor: colors.primary, paddingHorizontal: 0 }}
                />
                {displayNameError &&
                    <HelperText type="error" visible={true}>
                        {displayNameError}
                    </HelperText>
                }
                <View style={{ alignItems: "center" }}>
                    <Button mode="outlined"
                        icon="arrow-right"
                        loading={isLoading}
                        color={colors.button}
                        style={{
                            borderWidth: 1, borderColor: colors.button, marginTop: 20,
                            width: "60%", marginHorizontal: "auto"
                        }}
                        onPress={updateDisplayName}
                    >
                        {layoutState.isEnglish ? layoutState.EN.NEXT : layoutState.FR.NEXT}
                    </Button>
                </View>
            </ScrollView>
        </View>
    )
}

export default GetName