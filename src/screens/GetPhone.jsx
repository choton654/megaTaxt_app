import React, { useState, useContext, useCallback } from 'react'
import { View, InteractionManager, ScrollView, Platform } from 'react-native'
import { TextInput, Text, Button, useTheme, HelperText } from "react-native-paper"
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import Loader from '../components/Loader'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext'
import { updateUserPhone } from '../functions/auth'
import Header from '../components/Header'
import { LayoutContext } from '../context/LayoutContext'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

// import { getApp } from 'firebase/app'
// import { getAuth } from "firebase/auth"

// const app = getApp()
// const auth = getAuth()

const phoneUtil = PhoneNumberUtil.getInstance();

const GetPhone = () => {

    // const recaptchaVerifier = useRef(null)
    const navigation = useNavigation()
    const { colors } = useTheme()
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext)
    const [phone, setPhone] = useState('')
    const [isLoading, setisLoading] = useState(false)
    const [phoneError, setPhoneError] = useState(null)
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)
    const { state: layoutState } = useContext(LayoutContext)

    // const firebaseConfig = app ? app.options : undefined;

    const signinWithPhone = () => {
        if (phone.trim().length < 10) {
            setPhoneError("Phone no must have 10 digit ")
        } else {
            const phoneE164 = phoneUtil.format(phoneUtil.parse(phone, 'CA'), PhoneNumberFormat.E164);
            authDispatch({ type: "ADD PHONE NUMBER", payload: phoneE164 })
            // navigation.navigate("Stack", { screen: "ValidatePhone" })
            updateUserPhone(phoneE164, setisLoading, navigation,
                authDispatch, setPhoneError)
        }
    }

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                setDidFinishInitialAnimation(true)
                if (authState.phoneNo) {
                    setPhone(authState.phoneNo?.slice(-10, authState.phoneNo?.length));
                }
            })
            return () => task.cancel()
        }, []))

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {Platform.OS === "ios" && <Header title={layoutState.isEnglish ? layoutState.EN.USER_SET_UP : layoutState.FR.USER_SET_UP} />}
            <ScrollView keyboardDismissMode="none"
                contentContainerStyle={{ padding: 20 }}>
                <Text style={{ textAlign: "center", fontWeight: "700", fontSize: 20 }}>
                    {layoutState.isEnglish ? layoutState.EN.YOUR_PHONE : layoutState.FR.YOUR_PHONE}
                </Text>
                <TextInput
                    label="Phone"
                    keyboardType="phone-pad"
                    value={phone}
                    error={phoneError ? true : false}
                    onChangeText={text => {
                        let phoneInt = text;
                        try {
                            phoneInt = phoneUtil.format(phoneUtil.parse(text, 'CA'), PhoneNumberFormat.INTERNATIONAL);
                        } catch (e) { }
                        setPhone(phoneInt)
                        setPhoneError(null)
                    }}
                    activeUnderlineColor="#f59e0b"
                    style={{ backgroundColor: colors.primary, paddingHorizontal: 0 }}
                />
                {phoneError &&
                    <HelperText type="error" visible={true}>
                        {phoneError}
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
                        onPress={signinWithPhone}
                    >
                        {layoutState.isEnglish ? layoutState.EN.NEXT : layoutState.FR.NEXT}
                    </Button>
                </View>
            </ScrollView>
        </View>
    )
}

export default GetPhone