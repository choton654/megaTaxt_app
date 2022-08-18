import React, { useContext } from "react";
import { Dimensions, View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { useRoute, useNavigation, DrawerActions } from "@react-navigation/native";
import { LayoutContext } from "../context/LayoutContext";

const { height } = Dimensions.get("window");

const DrawerHeader = props => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { name } = useRoute();
  const { state: layoutState } = useContext(LayoutContext);

  return (
    <View
      style={{
        backgroundColor: colors.myOwnColor,
        ...styles.container,
      }}>
      <View style={[styles.div_1]}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <MaterialIcons name='menu' color={colors.primary} size={25} />
        </TouchableOpacity>
        <Text
          style={[
            {
              color: colors.primary,
              marginLeft: Platform.OS === "ios" && (name === "GetName" || name === "GetPhone") ? 0 : 25,
            },
            styles.text,
          ]}>
          {name === "Order Taxi"
            ? `${layoutState.isEnglish ? layoutState.EN.ORDER_TAXI : layoutState.FR.ORDER_TAXI}`
            : name === "Order List"
              ? `${layoutState.isEnglish ? layoutState.EN.ORDERS_HISTORY : layoutState.FR.ORDERS_HISTORY}`
              : name === "Sign In"
                ? `COOP Montreal - ${layoutState.isEnglish ? layoutState.EN.LOGIN : layoutState.FR.LOGIN}`
                : `${layoutState.isEnglish ? layoutState.EN.ACCOUNT : layoutState.FR.ACCOUNT}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: "center",
    height: Platform.OS === "ios" && height > 700 ? 105 : Platform.OS === "ios" && height < 700 ? 80 : 60,
    paddingTop: Platform.OS === "ios" && height > 700 ? 60 : Platform.OS === "ios" && height < 700 ? 30 : 10
  },
  text: {
    fontSize: 20,
    fontFamily: "Roboto_500Medium",
  },
  div_1: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default DrawerHeader;
