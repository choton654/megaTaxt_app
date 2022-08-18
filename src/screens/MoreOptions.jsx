import { ScrollView, View, StyleSheet, Platform, InteractionManager, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { Checkbox, useTheme, Text, Divider, Button } from 'react-native-paper'
import { AntDesign } from "@expo/vector-icons"
import Loader from '../components/Loader'
import { useNavigation } from '@react-navigation/native'
import { OrderContext } from '../context/OrderContext'
import Header from '../components/Header'
import { LayoutContext } from '../context/LayoutContext'

const MoreOptions = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext);
  const { state: layoutState } = useContext(LayoutContext);
  const { isCat, isDog, isCardoorOpen, isCarBoost } = orderState.moreOptions;

  const [keysArr, setKeysArr] = useState({
    isCat,
    isDog,
    isCardoorOpen,
    isCarBoost,
  });

//   const { isMoreOptionShown } = orderState;

  const setCarOptions = key => {
    setKeysArr({ ...keysArr, [key]: !keysArr[key] });
  };

  const setMoreOptions = () => {
    Object.keys(keysArr).forEach((item, idx) => {
      orderDispatch({ type: "SET CAR OPTIONS", payload: { key: item, value: Object.values(keysArr)[idx] } });
    });
    navigation.goBack();
  };

  const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false);

  //   orderDispatch({ type: "MORE OPTION SHOWN" });
  //   orderDispatch({ type: "MORE OPTION HIDDEN" });
  // if (!isMoreOptionShown) {
  //     orderDispatch({ type: "CLEAR CAR OPTIONS" })
  // }

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setDidFinishInitialAnimation(true);
    });
  }, []);

  if (!didFinishInitialAnimation) {
    return <Loader />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {Platform.OS === "ios" && (
        <Header title={layoutState.isEnglish ? layoutState.EN.moreOptions : layoutState.FR.moreOptions} />
      )}
      <ScrollView style={styles.container}>
        <View>
          <Text style={{ marginHorizontal: 15, marginVertical: 10, color: colors.dark }}>
            {layoutState.isEnglish ? layoutState.EN.petOptions : layoutState.FR.petOptions}
          </Text>
          <Divider style={[styles.divider, { borderColor: colors.placeholder }]} />
          <TouchableOpacity
            style={styles.div_1}
            onPress={() => {
              setCarOptions("isCat");
            }}>
            {Platform.OS === "android" ? (
              <Checkbox
                status={keysArr.isCat ? "checked" : "unchecked"}
                uncheckedColor='#BDBDBD'
                onPress={() => {
                  setCarOptions("isCat");
                }}
                color={colors.myOwnColor}
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setCarOptions("isCat");
                }}
                style={{ marginLeft: 10 }}>
                {keysArr.isCat ? (
                  <AntDesign name='checksquare' size={20} color={colors.myOwnColor} />
                ) : (
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderWidth: 2,
                      borderColor: colors.placeholder,
                      borderRadius: 2,
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
            <Text style={styles.text_1}>
              {layoutState.isEnglish ? layoutState.EN.animalCat : layoutState.FR.animalCat}
            </Text>
          </TouchableOpacity>
          <Divider
            inset
            style={{
              borderWidth: 0.7,
              borderColor: colors.placeholder,
            }}
          />
          <TouchableOpacity
            style={styles.div_1}
            onPress={() => {
              setCarOptions("isDog");
            }}>
            {Platform.OS === "android" ? (
              <Checkbox
                status={keysArr.isDog ? "checked" : "unchecked"}
                uncheckedColor='#BDBDBD'
                onPress={() => {
                  setCarOptions("isDog");
                }}
                color={colors.myOwnColor}
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setCarOptions("isDog");
                }}
                style={{ marginLeft: 10 }}>
                {keysArr.isDog ? (
                  <AntDesign name='checksquare' size={20} color={colors.myOwnColor} />
                ) : (
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderWidth: 2,
                      borderColor: colors.placeholder,
                      borderRadius: 2,
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
            <Text style={styles.text_1}>
              {layoutState.isEnglish ? layoutState.EN.animalDog : layoutState.FR.animalDog}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={{ marginHorizontal: 15, marginVertical: 10, color: colors.dark }}>Need Help ?</Text>
          <Divider style={[styles.divider, { borderColor: colors.placeholder }]} />
          <TouchableOpacity
            style={styles.div_1}
            onPress={() => {
              setCarOptions("isCardoorOpen");
            }}>
            {Platform.OS === "android" ? (
              <Checkbox
                status={keysArr.isCardoorOpen ? "checked" : "unchecked"}
                uncheckedColor='#BDBDBD'
                onPress={() => {
                  setCarOptions("isCardoorOpen");
                }}
                color={colors.myOwnColor}
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setCarOptions("isCardoorOpen");
                }}
                style={{ marginLeft: 10 }}>
                {keysArr.isCardoorOpen ? (
                  <AntDesign name='checksquare' size={20} color={colors.myOwnColor} />
                ) : (
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderWidth: 2,
                      borderColor: colors.placeholder,
                      borderRadius: 2,
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
            <View style={styles.div_2}>
              <Text style={styles.text_1}>
                {layoutState.isEnglish
                  ? layoutState.EN.servicesOpeningDoor
                  : `${layoutState.FR.servicesOpeningDoor.slice(
                      0,
                      layoutState.FR.servicesOpeningDoor.length - 6
                    )}...`}
              </Text>
              <Text style={{ color: colors.placeholder }}>$35.00*</Text>
            </View>
          </TouchableOpacity>
          <Divider
            inset
            style={{
              borderWidth: 0.6,
              borderColor: colors.placeholder,
            }}
          />
          <TouchableOpacity
            style={styles.div_1}
            onPress={() => {
              setCarOptions("isCarBoost");
            }}>
            {Platform.OS === "android" ? (
              <Checkbox
                status={keysArr.isCarBoost ? "checked" : "unchecked"}
                uncheckedColor='#BDBDBD'
                onPress={() => {
                  setCarOptions("isCarBoost");
                }}
                color={colors.myOwnColor}
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setCarOptions("isCarBoost");
                }}
                style={{ marginLeft: 10 }}>
                {keysArr.isCarBoost ? (
                  <AntDesign name='checksquare' size={20} color={colors.myOwnColor} />
                ) : (
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderWidth: 2,
                      borderColor: colors.placeholder,
                      borderRadius: 2,
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
            <View style={styles.div_2}>
              <Text style={styles.text_1}>
                {layoutState.isEnglish ? layoutState.EN.servicesCarBoost : layoutState.FR.servicesCarBoost}
              </Text>
              <Text style={{ color: colors.placeholder }}>$25.00*</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Button mode='contained' color={colors.button} style={styles.button} onPress={setMoreOptions}>
          {layoutState.isEnglish ? layoutState.EN.setOptions : layoutState.FR.setOptions}
        </Button>
        <Text
          style={{
            width: "90%",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 10,
            fontFamily: "Roboto_400Regular",
            textAlign: "left",
          }}>
          *{" "}
          {layoutState.isEnglish
            ? layoutState.EN.discountOptionsDisclaimer
            : layoutState.FR.discountOptionsDisclaimer}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "#fff",
    },
    divider: {
        width: "100%", marginTop: 5,
        borderWidth: 0.4
    },
    text_1: { marginLeft: Platform.OS === "ios" ? 30 : 25, fontSize: 15 },
    div_1: {
        flexDirection: "row", alignItems: "center", height: 50,
        paddingHorizontal: 15
    },
    div_2: {
        flexDirection: "row", justifyContent: "space-between",
        width: "90%"
    },
    button: { marginTop: 25, width: "90%", marginLeft: "auto", marginRight: "auto" }
})

export default MoreOptions