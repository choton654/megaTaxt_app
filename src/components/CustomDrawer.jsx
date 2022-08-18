import React, { useContext } from 'react'
import { View, Platform, Linking, TouchableOpacity, Dimensions, Pressable } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { LayoutContext } from "../context/LayoutContext";
import { OrderContext } from '../context/OrderContext';

const { height } = Dimensions.get("window");

const CustomDrawer = props => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { state: authState } = useContext(AuthContext);
  const { state: layoutState, dispatch: layoutDispatch } = useContext(LayoutContext);
  const { state: orderState } = useContext(OrderContext)


  const drawerAction = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    layoutDispatch({ type: "CHANGE LANGUAGE" });
  };

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === "ios" && (
        <View
          style={{
            height: height > 700 ? 45 : 20,
            backgroundColor: colors.myOwnColor,
          }}></View>
      )}
      <View
        style={{
          paddingTop: height > 700 ? 0 : 10,
          backgroundColor: colors.myOwnColor,
          height: 60,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          paddingHorizontal: 15,
          alignItems: "center",
          elevation: 6,
        }}>
        <Text style={{ color: colors.primary, fontSize: 20, fontFamily: "Roboto_500Medium" }}>
          COOP Montréal
        </Text>
        <TouchableOpacity style={{ marginTop: 2 }} onPress={drawerAction}>
          <Text style={{ color: colors.primary, fontSize: 16, fontFamily: "Roboto_400Regular" }}>
            {layoutState.isEnglish ? layoutState.EN.FR : layoutState.FR.EN}
          </Text>
        </TouchableOpacity>
      </View>
      <DrawerContentScrollView {...props}
        contentContainerStyle={{
          paddingTop: 0, flex: 1,
          justifyContent: "space-between"
        }}>
        <View>
          {authState.phoneNo && (
            <View style={{ height: 60, paddingTop: 15, paddingLeft: 20 }}>
              <Text style={{ color: colors.dark, fontSize: 15, fontFamily: "Roboto_400Regular" }}>
                {layoutState.isEnglish ? layoutState.EN.NAVIGATE : layoutState.FR.NAVIGATE}
              </Text>
            </View>
          )}
          <DrawerItemList {...props} />
          {authState.phoneNo && (
            <Pressable
              style={{
                height: 50,
                paddingVertical: 10,
                paddingLeft: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                Linking.openURL(`tel:${orderState.orderConfig?.phone}`);
              }}>
              <Ionicons name='call' size={24} color={colors.dark} />
              <View style={{ marginLeft: 30 }}>
                <Text
                  style={{
                    color: colors.dark,
                    fontSize: 16,
                    fontFamily: "Roboto_500Medium",
                  }}>
                  {layoutState.isEnglish ? layoutState.EN.call : layoutState.FR.call}
                </Text>
                <Text>{orderState.orderConfig?.phone}</Text>
              </View>
            </Pressable>
          )}
        </View>
        {authState.phoneNo && (
          <View style={{ borderTopWidth: 1, borderColor: colors.placeholder }}>
            <Text
              style={{
                marginBottom: 20,
                marginLeft: 20,
                paddingVertical: 10,
                fontSize: 17,
              }}>
              {authState.user?.email || "dev@megataxi.com"}
            </Text>
            <DrawerItem
              onPress={() => {
                navigation.navigate("Account");
                layoutDispatch({ type: "CHANGE DRAWER LAYOUT", payload: true });
              }}
              label={({ focused }) => (
                <Text
                  style={{
                    color: colors.dark,
                    fontSize: 16,
                    fontFamily: "Roboto_500Medium",
                  }}>
                  {layoutState.isEnglish ? layoutState.EN.ACCOUNT : layoutState.FR.ACCOUNT}
                </Text>
              )}
              icon={({ focused }) => <Ionicons name='person-circle-outline' size={24} color={colors.dark} />}
              activeBackgroundColor={colors.light}
              activeTintColor={colors.myOwnColor}
              labelStyle={{ fontSize: 18, fontWeight: "700", letterSpacing: 1 }}
              focused={layoutState.isAccountFocused}
              style={{
                marginHorizontal: 0,
                paddingHorizontal: 10,
                borderRadius: 0,
              }}
            />
            {Platform.OS === "ios" && height > 700 && <View style={{ height: 30, backgroundColor: "#fff" }} />}
          </View>
        )}
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer


  // <DrawerItem
          //   onPress={() => {
          //     Linking.openURL(`tel:+15143475397`);
          //   }}
          //   label={({ focused }) => (
          //     <View>
          //       <Text
          //         style={{
          //           color: colors.dark,
          //           fontSize: 16,
          //           fontFamily: "Roboto_500Medium",
          //         }}>
          //         {layoutState.isEnglish ? layoutState.EN.call : layoutState.FR.call}
          //       </Text>
          //       <Text>+15143475397</Text>
          //     </View>
          //   )}
          //   icon={({ focused }) => <Ionicons name='call' size={24} color={colors.dark} />}
          //   activeBackgroundColor={colors.light}
          //   activeTintColor={colors.myOwnColor}
          //   labelStyle={{
          //     fontSize: 18,
          //     fontWeight: "700",
          //     letterSpacing: 1,
          //   }}
          //   style={{
          //     marginHorizontal: 0,
          //     paddingHorizontal: 10,
          //     borderRadius: 0,
          //   }}
          // />