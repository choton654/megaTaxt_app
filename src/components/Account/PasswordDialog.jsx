import React, { useState } from 'react'
import { View } from 'react-native'
import { useTheme, Dialog, HelperText, Button, TextInput } from 'react-native-paper'
import { resetPassword } from '../../functions/auth'

const PasswordDialog = ({ hideDialog, email, layoutState }) => {

    const { colors } = useTheme()

    const [currentPassword, setCurrentPassword] = useState('')
    const [passwordError, setPasswordError] = useState(null)
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordError, setNewPasswordError] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPassError, setConfirmPassError] = useState(null)
    const [iseLoading, setIsLoading] = useState(false)

    const resetUserPassword = () => {
        if (currentPassword.trim().length < 6) {
            setPasswordError("Password must be 6 charecter long")
        } else if (newPassword.trim().length < 6) {
            setNewPasswordError("Password must be 6 charecter long")
        } else if (newPassword !== confirmPassword) {
            setConfirmPassError("Please re-type password")
        } else {
            resetPassword(email, currentPassword, newPassword,
                setPasswordError, setIsLoading, hideDialog)
        }
    }

    return (
        <View>
            <Dialog.Content>
                <TextInput
                    label={layoutState.isEnglish ? layoutState.EN.PASSWORD_CURRENT : layoutState.FR.PASSWORD_CURRENT}
                    value={currentPassword}
                    error={passwordError ? true : false}
                    secureTextEntry={true}
                    onChangeText={text => {
                        setCurrentPassword(text)
                        setPasswordError(null)
                        setConfirmPassError(null)
                        setNewPasswordError(null)
                    }}
                    activeUnderlineColor="#f59e0b"
                    style={{ marginTop: 10, backgroundColor: colors.primary, paddingHorizontal: 0 }}
                />
                {passwordError &&
                    <HelperText type="error" visible={true}>
                        {passwordError}
                    </HelperText>
                }
                <TextInput
                    label={layoutState.isEnglish ? layoutState.EN.PASSWORD_NEW : layoutState.FR.PASSWORD_NEW}
                    value={newPassword}
                    error={newPasswordError ? true : false}
                    secureTextEntry={true}
                    onChangeText={text => {
                        setNewPassword(text)
                        setNewPasswordError(null)
                        setPasswordError(null)
                        setConfirmPassError(null)
                    }}
                    activeUnderlineColor="#f59e0b"
                    style={{ marginTop: 10, backgroundColor: colors.primary, paddingHorizontal: 0 }}
                />
                {newPasswordError &&
                    <HelperText type="error" visible={true}>
                        {newPasswordError}
                    </HelperText>
                }
                <TextInput
                    label={layoutState.isEnglish ? layoutState.EN.PASSWORD_CONFIRM : layoutState.FR.PASSWORD_CONFIRM}
                    value={confirmPassword}
                    error={confirmPassError ? true : false}
                    secureTextEntry={true}
                    onChangeText={text => {
                        setConfirmPassword(text)
                        setConfirmPassError(null)
                        setNewPasswordError(null)
                        setPasswordError(null)
                    }}
                    activeUnderlineColor="#f59e0b"
                    style={{ marginTop: 10, backgroundColor: colors.primary, paddingHorizontal: 0 }}
                />
                {confirmPassError &&
                    <HelperText type="error" visible={true}>
                        {confirmPassError}
                    </HelperText>
                }
            </Dialog.Content>
            <Dialog.Actions>
                <Button mode='text' color={colors.myOwnColor}
                    loading={iseLoading}
                    onPress={hideDialog}>
                    {layoutState.isEnglish ? layoutState.EN.CANCEL : layoutState.FR.CANCEL}
                </Button>
                <Button mode='text' color={colors.myOwnColor}
                    loading={iseLoading}
                    onPress={resetUserPassword}>
                    {layoutState.isEnglish ? layoutState.EN.SAVE : layoutState.FR.SAVE}
                </Button>
            </Dialog.Actions>
        </View>
    )
}

export default PasswordDialog