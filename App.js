import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text } from "react-native"
import RootNavigation from './src/navigation/RootNavigation';
import { Provider as PaperProvider, DefaultTheme, Button } from 'react-native-paper';
import RootProvider from "./src/context"
import { SafeAreaProvider } from 'react-native-safe-area-context'
import colors from "./src/utils/colors"
import NetInfo, { useNetInfo } from "@react-native-community/netinfo"
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from '@expo-google-fonts/roboto';


export default function App() {

  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });
  const [OfflineStatus, setOfflineStatus] = useState(false)

  const theme = {
    ...DefaultTheme,
    myOwnProperty: true,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      dark: colors.dark,
      myOwnColor: colors.myOwnColor,
      button: colors.button,
      placeholder: colors.placeholder,
      light: colors.light,
      error: colors.error
    },
  };

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected || state.isInternetReachable === false;
      setOfflineStatus(offline);
    });

    return () => removeNetInfoSubscription();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />
  }

  if (OfflineStatus) {
    return (
      <View style={{
        flex: 1, padding: 20, backgroundColor: theme.colors.myOwnColor,
        alignItems: "center"
      }}>
        <StatusBar backgroundColor={colors.myOwnColor} hidden={false} />
        <Text style={{
          fontFamily: "Roboto_700Bold", color: theme.colors.dark,
          textAlign: "center", fontSize: 18
        }}>
          Tu es hors ligne
        </Text>
        <Text style={{
          fontFamily: "Roboto_400Regular", color: theme.colors.dark,
          textAlign: "center", fontSize: 15, marginTop: 10
        }}>
          Vous devez etre ligne pour utiliser cette application
        </Text>
        <Text style={{
          fontFamily: "Roboto_700Bold", color: theme.colors.dark,
          textAlign: "center", fontSize: 18, marginTop: 30
        }}>
          You are offline
        </Text>
        <Text style={{
          fontFamily: "Roboto_400Regular", color: theme.colors.dark,
          textAlign: "center", fontSize: 15, marginTop: 10
        }}>
          You must be online to use this application
        </Text>
        {/* <Button mode="contained" style={{
          backgroundColor: theme.colors.primary,
          marginTop: 20
        }}
          color={theme.colors.myOwnColor}
          onPress={() => {
            NetInfo.fetch().then(state => {
              console.log(state);
              console.log(netInfo.isConnected)
              if (state.isConnected) {
                setOfflineStatus(state.isConnected)
              }
            })
          }}>Try Again {netInfo.isConnected ? 'connected' : 'not connected'}
          </Button> */}
      </View>
    )
  }

  return (
    <RootProvider>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar backgroundColor={colors.myOwnColor} hidden={false} />
          <RootNavigation />
        </PaperProvider>
      </SafeAreaProvider>
    </RootProvider>
  );
}

{/* {Platform.OS === "ios" && <View style={{ height: getStatusBarHeight(), backgroundColor: colors.myOwnColor }} />} */ }
// react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
