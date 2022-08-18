import React, { useContext } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { LayoutContext } from "../../context/LayoutContext"

const UserInfo = ({ info, infoType, setEditInfo }) => {

    const navigation = useNavigation()
    const { colors } = useTheme()
    const { state: layoutState } = useContext(LayoutContext)

    const userInfoPress = () => {
        if (infoType === "phoneNumber") {
            navigation.navigate("Stack", { screen: "GetPhone" })
        } else if (infoType === "displayName") {
            setEditInfo("displayName")
        } else if (infoType === "changePassword") {
            setEditInfo("changePassword")
        }
    }

    return (
        <TouchableOpacity style={styles.div_2}
            onPress={userInfoPress}
        >
            <Text style={styles.subheading}>
                {infoType === "displayName" ? layoutState.isEnglish ? layoutState.EN.NAME : layoutState.FR.NAME :
                    infoType === "phoneNumber" ? layoutState.isEnglish ? layoutState.EN.PHONE : layoutState.FR.PHONE :
                        infoType === "email" ? layoutState.isEnglish ? layoutState.EN.EMAIL : layoutState.FR.EMAIL :
                            layoutState.isEnglish ? layoutState.EN.PASSWORD : layoutState.FR.PASSWORD}
            </Text>
            <Text style={styles.infoText}>{info}</Text>
            {infoType !== "changePassword" &&
                <Divider style={[styles.divider, { borderColor: colors.placeholder }]} />
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    subheading: { fontFamily: "Roboto_400Regular", marginBottom: 3, fontSize: 15 },
    infoText: { fontSize: 15, color: "#78716c" },
    divider: {
        width: "100%", marginTop: 15,
        borderWidth: 0.5
    },
    div_2: { marginTop: 10 }
})

export default UserInfo