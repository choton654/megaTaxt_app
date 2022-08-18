import {
  View, InteractionManager, Image,
  StyleSheet, TouchableOpacity, Dimensions,
  Platform, ActivityIndicator, Alert
} from 'react-native'
import React, { useRef, useCallback, useState, useContext, useEffect } from 'react'
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { useTheme, Text } from 'react-native-paper';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import Loader from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { getSingleOrder, cancelOrder } from '../functions/order';
import carMarker from "../../assets/img/car.png"
import userMarker from "../../assets/img/user.png"
import { LayoutContext } from '../context/LayoutContext';

const { width, height } = Dimensions.get('window')

const BASE_URL = "https://megataxi.herokuapp.com"
const LOCAL_BASE_URL = "http://10.0.2.2:8000"

const Header = ({ orderStatus, orderId }) => {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { state: layoutState } = useContext(LayoutContext);

  return (
    <View style={{
      ...styles.headerContainer,
      backgroundColor: colors.myOwnColor
    }}>
      <View style={styles.div_1}>
        <Text style={{ color: colors.primary, ...styles.text }}>
          {orderStatus}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          Alert.alert(`${layoutState.isEnglish ? layoutState.EN.cancelOrder : layoutState.FR.cancelOrder}`,
            `${layoutState.isEnglish ? layoutState.EN.cancelOrderConfirm : layoutState.FR.cancelOrderConfirm}`, [
            { text: "No", style: "cancel" },
            {
              text: "Yes", onPress: () => {
                cancelOrder(orderId)
                navigation.goBack()
              }
            },
          ])
        }
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Text style={{
          color: colors.primary,
          fontWeight: "700", fontSize: 17,
          letterSpacing: 1, marginRight: 10
        }}>{layoutState.isEnglish ? 'Cancel' : 'Annuler'}</Text>
        <FontAwesome name="minus-circle" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  )
}

const TrackOrder = () => {

  const { colors } = useTheme()
  const { params: { id } } = useRoute()
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const { state: authState } = useContext(AuthContext)
  const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)
  const [camera, setCamera] = useState(null)
  const [singleOrder, setSingleOrder] = useState(null)
  const [polyLine, setPolyLine] = useState([])
  const [isDriverLoading, setIsDriverLoading] = useState(true)

  const goTomyLocation = useCallback(() => {
    mapRef.current.animateCamera(camera, { duration: 3000 })
  }, [camera])

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(async () => {
        getSingleOrder(id, setSingleOrder, setPolyLine)
        setDidFinishInitialAnimation(true)

        try {
          const headers = { 'Content-Type': 'application/json' }
          const config = { method: 'POST', headers }
          const response = await fetch(`${BASE_URL}/order/${id}`, config)
          const data = await response.json()
          console.log("data", data)
          setIsDriverLoading(false)
        } catch (error) {
          console.log("error", error);
        }
      })
      return () => task.cancel()
    }, [])
  )

  useEffect(() => {
    if (singleOrder) {
      const { accuracy, altitude, altitudeAccuracy,
        heading, speed } = authState.location
      setCamera({
        center: {
          latitude: singleOrder.addressFrom.lat,
          longitude: singleOrder.addressFrom.lng
        },
        zoom: 15,
        // heading,
        pitch: 10,
        altitude,
        accuracy,
        altitudeAccuracy,
        speed
      })
    }
  }, [singleOrder])


  useEffect(() => {
    if (singleOrder && mapRef && markerRef) {
      const { accuracy, altitude, altitudeAccuracy,
        heading, speed } = authState.location
      mapRef.current?.animateCamera({
        center: {
          latitude: singleOrder?.vehicle?.lat,
          longitude: singleOrder?.vehicle?.lng
        },
        zoom: 13,
        // heading,
        pitch: 10,
        altitude,
        accuracy,
        altitudeAccuracy,
        speed
      })
    }
  }, [singleOrder?.vehicle])

  useEffect(() => {
    getSingleOrder(id, setSingleOrder, setPolyLine)
  }, [id])

  if (!didFinishInitialAnimation) { return <Loader /> }

  return (
    <View style={styles.container}>
      {singleOrder && <Header orderId={id} orderStatus={singleOrder.status} />}
      {camera && camera.center.latitude && camera.center.longitude && (
        <View style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            provider='google'
            initialRegion={{
              latitude: camera.center.latitude,
              longitude: camera.center.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}>
            <Marker
              coordinate={{
                latitude: camera.center.latitude,
                longitude: camera.center.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              draggable={false}>
              <Image source={userMarker} style={{ width: 30, height: 30 }} />
            </Marker>
            {singleOrder && singleOrder.vehicle && (
              <Marker
                ref={markerRef}
                coordinate={{
                  latitude: singleOrder.vehicle.lat,
                  longitude: singleOrder.vehicle.lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                draggable={false}>
                <Image source={carMarker} style={{ width: 30, height: 30 }} />
              </Marker>
            )}
            {polyLine.length > 0 && (
              <Polyline
                coordinates={polyLine}
                strokeColor={colors.myOwnColor}
                strokeColors={[colors.myOwnColor]}
                strokeWidth={7}
                geodesic={true}
              />
            )}
          </MapView>
          <TouchableOpacity style={styles.setmyLocation} onPress={goTomyLocation}>
            <Ionicons name='locate' color='#424242' size={25} />
          </TouchableOpacity>
        </View>
      )}
      {singleOrder && (
        <View style={[styles.bottomView, { backgroundColor: colors.primary }]}>
          {!isDriverLoading && singleOrder.driverInfo ? (
            <View style={{ flexDirection: "row" }}>
              <Image
                source={{
                  uri: singleOrder.driverInfo.imageUrl,
                }}
                style={{ width: 50, height: 50, borderRadius: 10 }}
              />
              <View
                style={{
                  marginLeft: 10,
                  height: 50,
                  justifyContent: "center",
                }}>
                <Text style={{ textAlign: "left", fontWeight: "Roboto_500Medium" }}>{singleOrder.driverInfo.name}</Text>
                <Text style={{ textAlign: "left", fontWeight: "Roboto_500Medium", color: colors.placeholder }}>{singleOrder.driverInfo.email}</Text>
              </View>
            </View>
          ) : (
            <View style={{ flexDirection: "row", height: 50, alignItems: "center" }}>
              <ActivityIndicator size={30} color={colors.myOwnColor} />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  marginLeft: 15,
                }}>
                Getting driver details...
              </Text>
            </View>
          )}
          {!isDriverLoading && (
            <View style={{ height: 50, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontWeight: "700" }}>
                {(singleOrder.vehicle?.distance / 1000).toFixed(1)} km left
              </Text>
              <Text style={{ fontWeight: "700" }}>
                {((singleOrder.vehicle?.time * 10) / 60).toFixed(1)} min left
              </Text>
            </View>
          )}
        </View>
      )}
      {Platform.OS === "ios" && height > 700 && <View style={{ height: 30, backgroundColor: "#fff" }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    width: "100%"
  },
  text: {
    fontSize: 18,
    fontWeight: "700"
  },
  div_1: {
    marginLeft: 10, flexDirection: 'row',
    alignItems: 'center'
  },
  setmyLocation: {
    position: "absolute",
    top: 15, right: 15,
    width: 32, height: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#bdbdbd",
  },
  bottomView: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    width,
    height: 80,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    elevation: 5,
    paddingVertical: 10,
  },
})

export default TrackOrder