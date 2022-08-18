import React, { useContext, Fragment } from 'react'
import { Dimensions } from "react-native"
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme, Text } from "react-native-paper"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import Signin from '../screens/Signin';
import OrderTaxi from '../screens/OrderTaxi';
import Account from "../screens/Account";
import OrderList from '../screens/OrderList';
import CustomDrawer from '../components/CustomDrawer';
import { drawerOptions } from '../utils/drawerOptions';
import { AuthContext } from '../context/AuthContext';
import { LayoutContext } from '../context/LayoutContext';
import DrawerHeader from "../components/DrawerHeader";

const { width } = Dimensions.get("window");

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const { colors } = useTheme();
  const { state: authState } = useContext(AuthContext);
  const { state: layoutState } = useContext(LayoutContext);

  return (
    <Drawer.Navigator
      initialRouteName='Order Taxi'
      screenOptions={{
        headerShown: true,
        // headerStyle: { backgroundColor: colors.myOwnColor },
        // headerTintColor: "#fff",
        header: props => <DrawerHeader {...props} />,
        drawerStyle: { backgroundColor: "#fff", width: width * 0.8 },
      }}
      drawerContent={props => <CustomDrawer {...props} />}
      edgeWidth={100}>
      <Drawer.Screen
        name='Order Taxi'
        options={{
          headerTitle: `${layoutState.isEnglish ? layoutState.EN.ORDER_TAXI : layoutState.FR.ORDER_TAXI}`,
          drawerLabel: ({ focused }) => (
            <Text
              style={{
                color: colors.dark,
                fontSize: 16,
                fontFamily: "Roboto_500Medium",
              }}>
              {layoutState.isEnglish ? layoutState.EN.ORDER_TAXI : layoutState.FR.ORDER_TAXI}
            </Text>
          ),
          drawerIcon: ({ focused }) => <Ionicons name='location' size={24} color={colors.dark} />,
          ...drawerOptions,
        }}
        component={OrderTaxi}
      />
      {authState.phoneNo ? (
        <Fragment>
          <Drawer.Screen
            name='Order List'
            options={{
              headerTitle: `${
                layoutState.isEnglish ? layoutState.EN.ORDERS_HISTORY : layoutState.FR.ORDERS_HISTORY
              }`,
              drawerLabel: ({ focused }) => (
                <Text
                  style={{
                    color: colors.dark,
                    fontSize: 16,
                    fontFamily: "Roboto_500Medium",
                  }}>
                  {layoutState.isEnglish ? layoutState.EN.ORDERS_HISTORY : layoutState.FR.ORDERS_HISTORY}
                </Text>
              ),
              drawerIcon: ({ focused }) => <Ionicons name='checkmark-circle' size={24} color={colors.dark} />,
              ...drawerOptions,
            }}
            component={OrderList}
          />
          <Drawer.Screen
            name='Account'
            options={{
              drawerItemStyle: { display: "none" },
              headerTitle: `${layoutState.isEnglish ? layoutState.EN.ACCOUNT : layoutState.FR.ACCOUNT}`,
            }}
            component={Account}
          />
        </Fragment>
      ) : (
        <Drawer.Screen
          name='Sign In'
          options={{
            headerTitle: `COOP Montreal - ${layoutState.isEnglish ? layoutState.EN.LOGIN : layoutState.FR.LOGIN}`,
            drawerLabel: ({ focused }) => (
              <Text
                style={{
                  color: colors.dark,
                  fontSize: 16,
                  fontFamily: "Roboto_500Medium",
                }}>
                {layoutState.isEnglish ? layoutState.EN.LOGIN : layoutState.FR.LOGIN}
              </Text>
            ),
            drawerIcon: ({ focused }) => <MaterialCommunityIcons name='login' size={24} color={colors.dark} />,
            ...drawerOptions,
          }}
          component={Signin}
        />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigation