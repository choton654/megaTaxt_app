import { View, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { Divider, useTheme, Text } from 'react-native-paper'
import { FontAwesome, Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { OrderContext } from '../../context/OrderContext'
import { LayoutContext } from '../../context/LayoutContext'

const GetOptions = () => {

  const { colors } = useTheme()
  const navigation = useNavigation()
  const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext)
  const { state: layoutState } = useContext(LayoutContext)

  const { paymentMethod, vehicle, moreOptions, isMoreOptionShown } = orderState

  return (
    <View>
      <Text style={{ fontSize: 17, padding: 15, fontFamily: "Roboto_500Medium" }}>
        {layoutState.isEnglish ? layoutState.EN.OPTIONS : layoutState.FR.OPTIONS}
      </Text>
      <Divider
        style={{
          width: "100%",
          borderWidth: 0.4,
          borderColor: colors.placeholder,
        }}
      />
      <View style={{ paddingHorizontal: 15 }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingTop: 10,
          }}
          onPress={() => navigation.navigate("Stack", { screen: "Payment" })}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name='payment' size={25} color={colors.dark} />
            <View style={{ marginLeft: 30 }}>
              <Text style={{ fontSize: 16, fontFamily: "Roboto_400Regular" }}>
                {layoutState.isEnglish ? layoutState.EN.paymentOptions : layoutState.FR.paymentOptions}
              </Text>
              {paymentMethod && (
                <Text style={{ fontSize: 14, fontFamily: "Roboto_700Bold" }}>
                  Pay in car by <Text style={{ fontFamily: "Roboto_400Regular" }}>{paymentMethod}</Text>
                </Text>
              )}
            </View>
          </View>
          {paymentMethod ? (
            <TouchableOpacity onPress={() => orderDispatch({ type: "CLEAR PAYMENT METHOD" })}>
              <FontAwesome name='close' size={22} color={colors.placeholder} />
            </TouchableOpacity>
          ) : (
            <FontAwesome name='angle-right' size={25} color={colors.placeholder} />
          )}
        </TouchableOpacity>
        <Divider
          style={{
            width: "90%",
            marginTop: 15,
            marginLeft: 52,
            borderWidth: 0.6,
            borderColor: colors.placeholder,
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingTop: 10,
          }}
          onPress={() => navigation.navigate("Stack", { screen: "Vehicle" })}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name='car-sport-outline' size={25} color={colors.dark} />
            <View style={{ marginLeft: 30 }}>
              <Text style={{ fontSize: 16, fontFamily: "Roboto_400Regular" }}>
                {layoutState.isEnglish ? layoutState.EN.carOptions : layoutState.FR.carOptions}
              </Text>
              {vehicle && <Text style={{ fontSize: 14, fontFamily: "Roboto_700Bold" }}>{vehicle}</Text>}
            </View>
          </View>
          {vehicle ? (
            <TouchableOpacity onPress={() => orderDispatch({ type: "CLEAR VEHICLE" })}>
              <FontAwesome name='close' size={22} color={colors.placeholder} />
            </TouchableOpacity>
          ) : (
            <FontAwesome name='angle-right' size={25} color={colors.placeholder} />
          )}
        </TouchableOpacity>
        <Divider
          style={{
            width: "90%",
            marginTop: 15,
            marginLeft: 52,
            borderWidth: 0.4,
            borderColor: colors.placeholder,
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingTop: 10,
          }}
          onPress={() => navigation.navigate("Stack", { screen: "More Options" })}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name='menuunfold' size={25} color={colors.dark} />
            <View>
              <Text style={{ marginLeft: 30, fontSize: 16, fontFamily: "Roboto_400Regular" }}>
                {layoutState.isEnglish ? layoutState.EN.moreOptions : layoutState.FR.moreOptions}
              </Text>
              {Object.values(moreOptions).includes(true) && (
                <View style={{ marginLeft: 30 }}>
                  {moreOptions.isCat && (
                    <Text style={{ fontSize: 14, fontFamily: "Roboto_700Bold" }}>
                      {layoutState.isEnglish ? layoutState.EN.animalCat : layoutState.FR.animalCat}
                    </Text>
                  )}
                  {moreOptions.isDog && (
                    <Text style={{ fontSize: 14, fontFamily: "Roboto_700Bold" }}>
                      {layoutState.isEnglish ? layoutState.EN.animalDog : layoutState.FR.animalDog}
                    </Text>
                  )}
                  {moreOptions.isCardoorOpen && (
                    <Text style={{ fontSize: 14, fontFamily: "Roboto_700Bold" }}>
                      {layoutState.isEnglish
                        ? layoutState.EN.servicesOpeningDoor
                        : layoutState.FR.servicesOpeningDoor}
                    </Text>
                  )}
                  {moreOptions.isCarBoost && (
                    <Text style={{ fontSize: 14, fontFamily: "Roboto_700Bold" }}>
                      {layoutState.isEnglish ? layoutState.EN.servicesCarBoost : layoutState.FR.servicesCarBoost}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
          {Object.values(moreOptions).includes(true) ? (
            <TouchableOpacity
              onPress={() => {
                orderDispatch({ type: "CLEAR CAR OPTIONS" });
                orderDispatch({ type: "MORE OPTION HIDDEN" });
              }}>
              <FontAwesome name='close' size={22} color={colors.placeholder} />
            </TouchableOpacity>
          ) : (
            <FontAwesome name='angle-right' size={25} color={colors.placeholder} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default GetOptions