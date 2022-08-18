import React, { useState, useContext, useCallback } from 'react'
import { View, InteractionManager, Platform, ScrollView } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { TextInput, Text, Button, useTheme, HelperText } from "react-native-paper"
import Loader from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { confirmCode, updateUserPhone } from '../functions/auth'
import Header from '../components/Header'
import { LayoutContext } from '../context/LayoutContext'

const ValidatePhone = () => {

    const navigation = useNavigation()
    const { colors } = useTheme()
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext)
    const { state: layoutState } = useContext(LayoutContext)
    const [code, setCode] = useState('')
    const [isLoading, setisLoading] = useState(false)
    const [isVerifyCodeLoading, setisVerifyCodeLoading] = useState(false)
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)
    const [codeError, setCodeError] = useState(null)

    const { phoneNo, phoneConfirmationObj } = authState

    const verifyPhoneNo = () => {
        if (code.trim().length < 6) {
            setCodeError("Verification code must be 6 digit long")
        } else {
            confirmCode(code, phoneConfirmationObj,
                setisLoading, navigation, authDispatch, setCodeError)
        }
    }

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                setDidFinishInitialAnimation(true)
            })
            return () => task.cancel()
        }, []))

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={{
            flex: 1,
            backgroundColor: "#fff"
        }}>
            {Platform.OS === "ios" && <Header title={layoutState.isEnglish ? layoutState.EN.USER_SET_UP : layoutState.FR.USER_SET_UP} />}
            <ScrollView
                keyboardDismissMode="none"
                contentContainerStyle={{ padding: 20 }}>
                <Text style={{ textAlign: "center", fontWeight: "700", fontSize: 20 }}>
                    {layoutState.isEnglish ? layoutState.EN.VALIDATE_YOUR_PHONE : layoutState.FR.VALIDATE_YOUR_PHONE}
                </Text>
                <Text style={{
                    textAlign: "center", fontWeight: "600", fontSize: 15,
                    marginTop: 20
                }}>
                    {phoneNo}</Text>
                <View style={{ alignItems: "center" }}>
                    <Button mode="outlined"
                        color={colors.myOwnColor}
                        loading={isVerifyCodeLoading}
                        onPress={() =>
                            updateUserPhone(phoneNo,
                                undefined, undefined,
                                authDispatch, undefined,
                                setisVerifyCodeLoading)}
                        style={{
                            borderWidth: 1,
                            borderColor: colors.myOwnColor,
                            marginTop: 20,
                            width: "90%"
                        }}
                    >
                        {layoutState.isEnglish ? layoutState.EN.GET_VALIDATION_CODE : layoutState.FR.GET_VALIDATION_CODE}
                    </Button>
                </View>
                <TextInput
                    label="Code"
                    keyboardType="phone-pad"
                    error={codeError ? true : false}
                    value={code}
                    onChangeText={text => {
                        setCode(text)
                        setCodeError(null)
                    }}
                    activeUnderlineColor="#f59e0b"
                    style={{
                        backgroundColor: colors.primary, paddingHorizontal: 0,
                        marginTop: 20
                    }}
                />
                {codeError &&
                    <HelperText type="error" visible={true}>
                        {codeError}
                    </HelperText>
                }
                <View style={{ alignItems: "center" }}>
                    <Button mode="outlined"
                        icon="arrow-right"
                        color={colors.button}
                        loading={isLoading}
                        style={{
                            borderWidth: 1, borderColor: colors.button, marginTop: 20,
                            width: "60%", marginHorizontal: "auto"
                        }}
                        onPress={verifyPhoneNo}
                    >
                        {layoutState.isEnglish ? layoutState.EN.NEXT : layoutState.FR.NEXT}
                    </Button>
                </View>
            </ScrollView>
        </View>
    )
}

export default ValidatePhone