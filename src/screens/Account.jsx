import React, { useCallback, useState, useContext, useEffect } from 'react'
import {
    StyleSheet, View, InteractionManager,
    TouchableOpacity, Platform, Alert
} from 'react-native'
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { Text, useTheme, Portal, Dialog } from 'react-native-paper'
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Loader from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { signoutUser } from '../functions/auth'
import PasswordDialog from '../components/Account/PasswordDialog'
import DisplayNameDialog from '../components/Account/DisplayNameDialog'
import UserInfo from '../components/Account/UserInfo'
import { LayoutContext } from "../context/LayoutContext"

const Account = () => {

    const navigation = useNavigation()
    const { colors } = useTheme()
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext)
    const { state: layoutState } = useContext(LayoutContext)

    const { user, displayName, phoneNo } = authState

    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)
    const [visible, setVisible] = useState(false)
    const [editInfo, setEditInfo] = useState(null)

    const openDialog = () => { setVisible(true) }
    const hideDialog = useCallback(() => {
        setVisible(false)
        setEditInfo(null)
    }, [])

    const logout = () => {
        Alert.alert(
            layoutState.isEnglish ? layoutState.EN.LOGOUT : layoutState.FR.LOGOUT,
            layoutState.isEnglish ? layoutState.EN.LOGOUT_CONFIRM_MESSAGE : layoutState.FR.LOGOUT_CONFIRM_MESSAGE,
            [
                {
                    text: layoutState.isEnglish ? layoutState.EN.NO : layoutState.FR.NO,
                    onPress: () => console.log('logout'),
                    style: "cancel"
                },
                {
                    text: layoutState.isEnglish ? layoutState.EN.YES : layoutState.FR.YES,
                    onPress: () => signoutUser(navigation, authDispatch)
                }
            ]
        );
    }

    useEffect(() => { if (editInfo) { openDialog() } }, [editInfo]);

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                setDidFinishInitialAnimation(true)
            })
            return () => task.cancel()
        }, [])
    )

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <Text style={styles.heading}>
                Account Settings
            </Text>
            <View style={styles.div_1}>
                <UserInfo info={displayName} infoType={"displayName"} setEditInfo={setEditInfo} />
                <UserInfo info={phoneNo.slice(-10, phoneNo.length)} infoType={"phoneNumber"} setEditInfo={setEditInfo} />
                <UserInfo info={user.email} infoType={"email"} setEditInfo={setEditInfo} />
                <UserInfo info={layoutState.isEnglish ? layoutState.EN.PASSWORD_CHANGE : layoutState.FR.PASSWORD_CHANGE} infoType={"changePassword"} setEditInfo={setEditInfo} />
            </View>
            <TouchableOpacity
                style={[styles.signoutButton, { backgroundColor: colors.light, borderBottomColor: colors.placeholder }]}
                onPress={logout}>
                <Text>{layoutState.isEnglish ? layoutState.EN.LOGOUT : layoutState.FR.LOGOUT}</Text>
                <MaterialCommunityIcons name='logout' size={25}
                    color={colors.dark} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.div_1}
                onPress={() => navigation.navigate("Stack", { screen: "Privecy Policy" })}
            >
                <Text>{layoutState.isEnglish ? layoutState.EN.privacyPolicy : layoutState.FR.privacyPolicy}</Text>
            </TouchableOpacity>

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>{editInfo === "displayName" ?
                        layoutState.isEnglish ? layoutState.EN.NAME_CHANGE : layoutState.FR.NAME_CHANGE :
                        layoutState.isEnglish ? layoutState.EN.PASSWORD_CHANGE : layoutState.FR.PASSWORD_CHANGE}</Dialog.Title>
                    {editInfo === "displayName" &&
                        <DisplayNameDialog hideDialog={hideDialog} fullName={displayName}
                            authDispatch={authDispatch} layoutState={layoutState} />
                    }
                    {editInfo === "changePassword" &&
                        <PasswordDialog hideDialog={hideDialog}
                            email={user.email} layoutState={layoutState} />
                    }
                </Dialog>
            </Portal>
        </View>
    )
}

export default Account

const styles = StyleSheet.create({
    container: { flex: 1 },
    heading: {
        fontSize: 15, fontFamily: "Roboto_400Regular",
        marginTop: 20, marginLeft: 20, color: "#78716c"
    },
    div_1: { marginTop: 30, marginLeft: 20 },
    signoutButton: {
        marginTop: 30, width: "100%",
        height: 50, borderBottomWidth: 0.8,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20, flexDirection: "row"
    }
})