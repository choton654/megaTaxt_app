import React, { useContext } from 'react'
import { View, TouchableOpacity, Platform } from "react-native"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from "@react-navigation/native"
import { useTheme, Text } from "react-native-paper"
import Signup from '../screens/Signup';
import ForgotPass from '../screens/ForgotPass';
import PrivecyPolicy from '../screens/PrivecyPolicy';
import GetName from '../screens/GetName';
import GetPhone from '../screens/GetPhone';
import ValidatePhone from '../screens/ValidatePhone';
import Map from '../screens/Map';
import SelectPayment from '../screens/SelectPayment';
import SelectVehicle from '../screens/SelectVehicle';
import MoreOptions from '../screens/MoreOptions';
import SingleOrder from '../screens/SingleOrder';
import { signoutUser } from "../functions/auth"
import { AuthContext } from '../context/AuthContext'
import TrackOrder from '../screens/TrackOrder';
import { LayoutContext } from '../context/LayoutContext';


const Stack = createNativeStackNavigator()

const StackNavigation = () => {

    const { colors } = useTheme()
    const navigation = useNavigation()
    const { dispatch: authDispatch } = useContext(AuthContext)
    const { state: layoutState, dispatch: layoutDispatch } = useContext(LayoutContext)

    return (
        <Stack.Navigator screenOptions={{
            headerShown: Platform.OS === "ios" ? false : true,
            headerStyle: { backgroundColor: colors.myOwnColor },
            headerTintColor: colors.primary
        }}>
            <Stack.Screen name='Sign up' component={Signup}
                options={{
                    title: layoutState.isEnglish ? layoutState.EN.SIGN_UP : layoutState.FR.SIGN_UP
                }}
            />
            <Stack.Screen name="GetName" component={GetName}
                options={{
                    title: layoutState.isEnglish ? layoutState.EN.USER_SET_UP : layoutState.FR.USER_SET_UP,
                    headerBackVisible: false,
                    headerRight: () =>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity style={{ marginTop: 2 }} onPress={() => { layoutDispatch({ type: "CHANGE LANGUAGE" }) }}>
                                <Text style={{
                                    color: colors.primary,
                                    fontFamily: "Roboto_400Regular",
                                    fontSize: 17
                                }}>
                                    {layoutState.isEnglish ? layoutState.EN.FR : layoutState.FR.EN}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => signoutUser(navigation, authDispatch)}>
                                <Text style={{
                                    marginTop: 2,
                                    marginLeft: 5,
                                    color: colors.primary,
                                    fontFamily: "Roboto_400Regular",
                                    fontSize: 17
                                }}>{layoutState.isEnglish ? layoutState.EN.LOGOUT : layoutState.FR.LOGOUT}</Text>
                            </TouchableOpacity>
                        </View>
                }} />
            <Stack.Screen name="GetPhone" component={GetPhone}
                options={{ title: layoutState.isEnglish ? layoutState.EN.USER_SET_UP : layoutState.FR.USER_SET_UP }} />
            <Stack.Screen name="ValidatePhone" component={ValidatePhone}
                options={{ title: layoutState.isEnglish ? layoutState.EN.USER_SET_UP : layoutState.FR.USER_SET_UP }} />
            <Stack.Screen name='Forgot Password'
                options={{ title: layoutState.isEnglish ? layoutState.EN.FORGOT_PASSWORD : layoutState.FR.FORGOT_PASSWORD }}
                component={ForgotPass} />
            <Stack.Screen name="Address From" options={{
                title: "Search 'from' address",
                headerShown: false
            }} component={Map} />
            <Stack.Screen name="Address To" options={{
                title: "Search 'to' address",
                headerShown: false
            }} component={Map} />
            <Stack.Screen name="Track Order" options={{ headerShown: false }}
                component={TrackOrder} />
            <Stack.Screen name="Payment"
                options={{ title: layoutState.isEnglish ? layoutState.EN.PAYMENT_METHODS : layoutState.FR.PAYMENT_METHODS }}
                component={SelectPayment} />
            <Stack.Screen name="Vehicle"
                options={{ title: layoutState.isEnglish ? layoutState.EN.selectVehicle : layoutState.FR.selectVehicle }}
                component={SelectVehicle} />
            <Stack.Screen name="More Options"
                options={{ title: layoutState.isEnglish ? layoutState.EN.moreOptions : layoutState.FR.moreOptions }}
                component={MoreOptions} />
            <Stack.Screen name='Privecy Policy'
                options={{ title: `COOP Monteral-${layoutState.isEnglish ? layoutState.EN.privacyPolicy : layoutState.FR.privacyPolicy}` }}
                component={PrivecyPolicy} />
            <Stack.Screen name='Order'
                options={{ title: `${layoutState.isEnglish ? layoutState.EN.ORDER : layoutState.FR.ORDER}` }}
                component={SingleOrder} />
        </Stack.Navigator>
    )
}

export default StackNavigation