import React, { useState } from 'react'
import { View } from 'react-native'
import { useTheme, Dialog, HelperText, Button, TextInput } from 'react-native-paper'
import { updateUser } from '../../functions/auth'

const DisplayNameDialog = ({ hideDialog, authDispatch, layoutState, fullName }) => {

    const { colors } = useTheme()

    const [displayName, setDisplayName] = useState(fullName)
    const [displayNameError, setDisplayNameError] = useState(null)
    const [isLoading, setisLoading] = useState(false)

    const updateDisplayName = async () => {
        if (displayName.trim() === '') {
            setDisplayNameError("Display name can't be empty")
        } else if (displayName.trim() < 3) {
            setDisplayNameError("Display name too sort")
        } else {
            updateUser(displayName, setisLoading, undefined, authDispatch, hideDialog)
        }
    }

    return (
        <View>
            <Dialog.Content>
                <TextInput
                    label={layoutState.isEnglish ? layoutState.EN.FULL_NAME : layoutState.FR.FULL_NAME}
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
            </Dialog.Content>
            <Dialog.Actions>
                <Button mode='text' color={colors.myOwnColor}
                    loading={isLoading}
                    onPress={hideDialog}>
                    {layoutState.isEnglish ? layoutState.EN.CANCEL : layoutState.FR.CANCEL}
                </Button>
                <Button mode='text' color={colors.myOwnColor}
                    loading={isLoading}
                    onPress={updateDisplayName}>
                    {layoutState.isEnglish ? layoutState.EN.SAVE : layoutState.FR.SAVE}
                </Button>
            </Dialog.Actions>
        </View>
    )
}

export default DisplayNameDialog