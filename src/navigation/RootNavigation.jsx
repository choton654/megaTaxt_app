import React, { useContext, useEffect, useState } from 'react'
import { View, InteractionManager, Platform, Alert, Linking, BackHandler } from 'react-native';
import * as Location from 'expo-location'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigation from './DrawerNavigation';
import StackNavigation from './StackNavigation';
import { AuthContext } from '../context/AuthContext';
import auth from '@react-native-firebase/auth';
import Loader from '../components/Loader';
import colors from '../utils/colors';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const Stack = createNativeStackNavigator()

const MainApp = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Drawer'>
      <Stack.Screen name='Drawer' component={DrawerNavigation} />
      <Stack.Screen name='Stack'>
        {(props) => (
          <View style={{ flex: 1 }}>
            {Platform.OS === 'ios' &&
              <View style={{
                height: getStatusBarHeight(true),
                backgroundColor: colors.myOwnColor
              }}>
              </View>}
            <StackNavigation {...props} />
          </View>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

const RootNavigation = () => {

  const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)
  const { dispatch: authDispatch } = useContext(AuthContext)

  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      const unSubscribe = auth().onAuthStateChanged(user => {
        if (user) {
          // console.log("user", user.uid)
          authDispatch({ type: 'SIGN UP', payload: user })
        } else {
          console.log('user not available');
        }
      })
      unSubscribe()
      let { status } = await Location.getForegroundPermissionsAsync()
      await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        const { status: oldStatus } = await Location.requestForegroundPermissionsAsync();
        if (oldStatus !== 'granted') {
          const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
          if (newStatus !== 'granted') {
            return Alert.alert(
              "Allow location",
              "Location should be enabled to order Taxi",
              [
                { text: "Cancel", onPress: () => BackHandler.exitApp(), style: "cancel" },
                { text: "OK", onPress: () => Linking.openSettings() }
              ]
            );
          }
        }
      }
      setDidFinishInitialAnimation(true)
    })
  }, [])

  if (!didFinishInitialAnimation) { return <Loader /> }

  return (
    <NavigationContainer>
      <MainApp />
    </NavigationContainer>
  )
}

export default RootNavigation