import React, { useContext } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { signoutUser } from "../functions/auth";
import { AuthContext } from "../context/AuthContext";
import { verticalScale } from "../utils/mixins";

const { height } = Dimensions.get("window");

const Header = ({ title }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { name } = useRoute();
  const { dispatch: authDispatch } = useContext(AuthContext);

  return (
    <View
      style={{
        backgroundColor: colors.myOwnColor,
        ...styles.container,
      }}>
      <View
        style={[
          styles.div_1,
          Platform.OS === "ios" &&
          (name === "GetName" || name === "GetPhone") && { justifyContent: "space-between" },
        ]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name='arrowleft' color={colors.primary} size={25} style={{ marginBottom: 10 }} />
        </TouchableOpacity>
        <Text
          style={[
            {
              color: colors.primary,
              marginLeft: Platform.OS === "ios" && (name === "GetName" || name === "GetPhone") ? 0 : 25,
              fontSize: Platform.OS === "ios" && name === "Privecy Policy" ? 12 : 15
            },
            styles.text,
          ]}>
          {title}
        </Text>
        {Platform.OS === "ios" && (name === "GetName" || name === "GetPhone") && (
          <TouchableOpacity
            onPress={() => signoutUser(navigation, authDispatch)}
            style={{ marginBottom: 10, marginRight: 5 }}>
            <Text
              style={{
                color: colors.primary,
                fontWeight: "700",
                fontSize: 17,
                letterSpacing: 1,
              }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: height > 700 ? 10 : 10,
    justifyContent: "center",
    height: height > 700 ? verticalScale(60) : verticalScale(80),
  },
  text: {
    marginBottom: 10,
    fontSize: 20,
    fontFamily: "Roboto_500Medium",
  },
  div_1: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Header

{/* {name === "Order List" || name === "Account" || name === "Order Taxi" ?
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                        <MaterialCommunityIcons name='menu' color={colors.primary} size={25} />
                    </TouchableOpacity>
                    :
                } */}