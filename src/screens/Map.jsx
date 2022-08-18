import {
  View,
  StyleSheet,
  InteractionManager,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Loader from '../components/Loader';
import marker from '../../assets/img/map-pin-icon.png';
import MapView from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import MapHeader from '../components/Map/MapHeader';
import SearchItem from '../components/Map/SearchItem';
import { GOOGLE_PLACES_API_KEY } from '../config';
import { getLocationFromPlaceId } from '../functions/order';
import { LayoutContext } from '../context/LayoutContext';

const { width, height } = Dimensions.get('window');

const Map = () => {

  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const { state: orderState, dispatch: orderDispatch } =
    useContext(OrderContext);
  const { state: layoutState } = useContext(LayoutContext);

  const [camera, setCamera] = useState(null);
  const [newCoords, setNewCoords] = useState(null);
  const [isDisabled, setisDisabled] = useState(true);
  const [didFinishInitialAnimation, setDidFinishInitialAnimation] =
    useState(false);
  const [isSearchPopUp, setIsSearchPopUp] = useState(false);
  const [isMapmovementFix, setisMapmovementFix] = useState(true);
  const [address, setAddess] = useState('');
  const [addressList, setAddressList] = useState([])

  const setLocationAddress = useCallback(async () => {

    if (!isDisabled) {
      if (route.name === 'Address From' && address) {
        orderDispatch({ type: 'SET ADDRESS FROM', payload: address });
      } else if (route.name === 'Address To' && address) {
        orderDispatch({ type: 'SET ADDRESS TO', payload: address });
      }
      // set recent search result to database
      const isExists = addressList.find(
        (addressItem) => addressItem.place_id === address.id
      );
      if (!isExists) {
        try {
          const createdAt = Date.now();
          let newAddress = JSON.parse(JSON.stringify(address));
          newAddress['createdAt'] = createdAt;

          const { uid } = auth().currentUser;

          if (addressList.length >= 5) {
            const firstAddress = addressList[0];
            await database()
              .ref(`userPlaces/${uid}/${firstAddress.createdAt}`)
              .remove(() => console.log('address deleted'));
            setAddressList(addressList.filter(item =>
              item.createdAt !== firstAddress.createdAt))
          }

          await database()
            .ref('userPlaces')
            .child(`${uid}/${createdAt}`)
            .set(newAddress, (err) => {
              if (err) {
                console.error('Failed to save recent search', err);
              }
              setAddressList([...addressList, {
                address: newAddress.address,
                locationName: newAddress.name,
                place_id: newAddress.id,
                createdAt,
              }])

            });
        } catch (error) {
          console.log('error', error);
        }
      }
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } else {
      ToastAndroid.showWithGravity(
        `Opps!! You need to select address`,
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }
  }, [address, route.name, addressList]);

  const goTomyLocation = useCallback(() => {
    const camera = {
      ...camera,
      center: {
        latitude: authState.location?.latitude,
        longitude: authState.location?.longitude,
      },
    };
    mapRef.current.animateCamera(camera, { duration: 500 });
    getGeoCodeData({
      latitude: authState.location?.latitude,
      longitude: authState.location?.longitude,
    });
  }, [camera]);

  const getGeoCodeData = async (region, isGesture) => {
    const { latitude, longitude } = region;
    const headers = { 'Content-Type': 'application/json' };
    const config = { method: 'GET', headers };
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}`;
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      // console.log("geoCoding result", data.results[0].address_components)
      const { place_id, formatted_address, address_components } =
        data.results[0];
      const locationName = address_components.find((address) =>
        address.types.includes('locality')
      ).long_name;
      const item = { address: formatted_address, locationName };
      setisMapmovementFix(false);
      getLocationFromPlaceId(
        place_id,
        item,
        route,
        undefined,
        setNewCoords,
        undefined,
        setAddess
      );
    } catch (error) {
      // console.log("error", error.message);
      if (error.message === 'Network request failed') {
        Platform.OS === 'ios'
          ? alert(`Please connect your internet`)
          : ToastAndroid.showWithGravity(
            `Please connect your internet`,
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
      }
    }
  };
  const changeRegion = useCallback(
    (region, { isGesture }) => {
      if (isGesture && authState.phoneNo) {
        getGeoCodeData(region);
      }
    },
    [orderState.isRegionChange]
  );

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(async () => {
        if (authState.phoneNo && authState.location) {
          setisDisabled(false);
        }

        try {
          if (auth().currentUser) {

            const { uid } = auth().currentUser;
            //fetch recent address
            const snapshot2 = await database().ref(`userPlaces/${uid}`).once('value');
            const recentDataObj = snapshot2.val();

            let addressArr = [];
            if (recentDataObj) {
              Object.keys(recentDataObj).forEach((key) => {
                const element = recentDataObj[key];
                if (element.address !== undefined && element.name !== undefined &&
                  element.id !== undefined && element.createdAt !== undefined) {
                  const address = {
                    address: element.address,
                    locationName: element.name,
                    place_id: element.id,
                    createdAt: element.createdAt,
                  };
                  addressArr.push(address);
                }
              });
            }

            addressArr = addressArr.reverse().slice(0, 5);
            setAddressList(addressArr)
          }

        } catch (error) {
          console.log('address fetch error', error);
        }

        if (authState.location) {
          // getting location data
          const {
            accuracy,
            altitude,
            altitudeAccuracy,
            heading,
            latitude,
            longitude,
            speed,
          } = authState.location;

          // getGeoCodeData({ latitude, longitude })

          if (route.name === 'Address From' && orderState.addressFrom) {
            setCamera({
              center: {
                latitude: orderState.addressFrom.lat,
                longitude: orderState.addressFrom.lng,
              },
              zoom: 18,
              // heading,
              pitch: 10,
              altitude,
              accuracy,
              altitudeAccuracy,
              speed,
            });
            setAddess(orderState.addressFrom);
          } else if (route.name === 'Address To' && orderState.addressTo) {
            setCamera({
              center: {
                latitude: orderState.addressTo.lat,
                longitude: orderState.addressTo.lng,
              },
              zoom: 18,
              // heading,
              pitch: 10,
              altitude,
              accuracy,
              altitudeAccuracy,
              speed,
            });
            setAddess(orderState.addressTo);
          } else {
            setCamera({
              center: { latitude, longitude },
              zoom: 18,
              // heading,
              pitch: 10,
              altitude,
              accuracy,
              altitudeAccuracy,
              speed,
            });
          }
        }
        setDidFinishInitialAnimation(true);
      });
      return () => task.cancel();
    }, [])
  );

  useEffect(() => {
    if (orderState.searchBarText.trim().length <= 3) {
      authDispatch({ type: 'SET FORMATTED ADDRESS', payload: [] });
    } else if (addressList.length > 0) {
      setIsSearchPopUp(true);
    }
  }, [orderState.searchBarText, authState.formattedAddressList.length]);

  useEffect(() => {
    if (newCoords && mapRef && isMapmovementFix) {
      const locObj = {
        ...camera,
        center: { latitude: newCoords.lat, longitude: newCoords.lng },
      };
      mapRef.current.animateCamera(locObj, { duration: 500 });
    }
  }, [newCoords, isMapmovementFix]);


  if (!didFinishInitialAnimation) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <MapHeader setIsSearchPopUp={setIsSearchPopUp} />

      {isSearchPopUp &&
        (authState.formattedAddressList.length > 0 ||
          addressList.length > 0) && (
          <View style={styles.searchBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {authState.formattedAddressList.length > 0 && (
                <View>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      height: 40,
                      backgroundColor: colors.light,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.placeholder,
                    }}>
                    <Text style={{ marginTop: 10 }}>Search Results</Text>
                  </View>
                  {authState.formattedAddressList.map((item, idx) => (
                    <SearchItem
                      key={idx}
                      item={item}
                      colors={colors}
                      setNewCoords={setNewCoords}
                      setIsSearchPopUp={setIsSearchPopUp}
                      setisMapmovementFix={setisMapmovementFix}
                      length={authState.formattedAddressList.length}
                      idx={idx}
                      setAddess={setAddess}
                    />
                  ))}
                </View>
              )}
              {addressList.length > 0 && (
                <View>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      height: 40,
                      backgroundColor: colors.light,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.placeholder,
                    }}>
                    <Text style={{ marginTop: 10 }}>Recent</Text>
                  </View>
                  {addressList.map((item, idx) => (
                    <SearchItem
                      key={idx}
                      item={item}
                      colors={colors}
                      setNewCoords={setNewCoords}
                      setIsSearchPopUp={setIsSearchPopUp}
                      setisMapmovementFix={setisMapmovementFix}
                      recent
                      length={addressList.length}
                      idx={idx}
                      setAddess={setAddess}
                    />
                  ))}
                </View>
              )}
              <View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    height: 40,
                    backgroundColor: colors.light,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.placeholder,
                  }}>
                  <Text style={{ marginTop: 10 }}>Specify on map</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    authDispatch({
                      type: 'SET FORMATTED ADDRESS',
                      payload: [],
                    });
                    setTimeout(() => {
                      setIsSearchPopUp(false);
                    }, 500);
                  }}
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                  }}>
                  <Ionicons
                    name="location"
                    size={20}
                    color={colors.myOwnColor}
                  />
                  <Text style={{ marginLeft: 10 }}>Specify on map</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

      {authState.location && camera ? (
        <View style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            provider="google"
            initialRegion={{
              latitude: camera.center.latitude,
              longitude: camera.center.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            initialCamera={{
              altitude: camera.altitude,
              center: {
                latitude: camera.center.latitude,
                longitude: camera.center.longitude
              },
              heading: 10,
              pitch: 10,
              zoom: 18
            }}
            showsUserLocation={true}
            onRegionChangeComplete={changeRegion}>

          </MapView>
          <TouchableOpacity
            style={styles.setmyLocation}
            onPress={goTomyLocation}>
            <Ionicons name="locate" color="#424242" size={25} />
          </TouchableOpacity>
          <Image
            source={marker}
            style={{
              width: 30,
              height: 30,
              position: 'absolute',
              top: '45%',
              right: '45%',
            }}
          />
        </View>
      ) : (
        <MapView ref={mapRef} style={{ flex: 1 }} provider="google" />
      )}

      {!isSearchPopUp && (
        <View style={[styles.bottomView, { backgroundColor: colors.primary }]}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#424242' }}>
            {route.name === 'Address From'
              ? layoutState.isEnglish
                ? layoutState.EN.IS_THIS_YOUR_LOCATION
                : layoutState.FR.IS_THIS_YOUR_LOCATION
              : layoutState.isEnglish
                ? layoutState.EN.WHERE_ARE_YOU_GOING
                : layoutState.FR.WHERE_ARE_YOU_GOING}
          </Text>
          {authState.location ? (
            route.name === 'Address From' ? (
              <Text style={{ marginTop: 5 }}>
                {address.title ||
                  // orderState.addressFrom?.title
                  'Drag your marker to select location'}
              </Text>
            ) : (
              <Text style={{ marginTop: 5 }}>
                {address.title ||
                  // orderState.addressTo?.title
                  'Drag your marker to select location'}
              </Text>
            )
          ) : (
            <Text>Sign in to select your search location</Text>
          )}
          <TouchableOpacity
            style={[
              styles.button,
              {
                opacity: isDisabled ? 0.7 : 1,
                backgroundColor: isDisabled ? '#fca5a5' : colors.button,
              },
            ]}
            disabled={isDisabled}
            onPress={setLocationAddress}>
            <Ionicons name="checkmark" color={colors.primary} size={30} />
          </TouchableOpacity>
        </View>
      )}

      {Platform.OS === 'ios' && height > 700 && (
        <View style={{ height: 30, backgroundColor: '#fff' }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  setmyLocation: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#bdbdbd',
  },
  searchBox: {
    position: 'absolute',
    top: 60,
    bottom: 0,
    height: Platform.OS === 'ios' && height > 700 ? height - 130 : height - 80,
    zIndex: 3,
    width: '100%',
    elevation: 3,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  bottomView: {
    position: 'relative',
    width,
    height: 80,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    elevation: 5,
    paddingVertical: 10,
  },
  button: {
    width: 50,
    height: 50,
    position: 'absolute',
    right: 20,
    top: -20,
    borderRadius: 25,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Map;