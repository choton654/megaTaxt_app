import database from '@react-native-firebase/database';
import functions from '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';
import { decode } from '@googlemaps/polyline-codec';
import { Platform } from 'react-native';
import { GOOGLE_PLACES_API_KEY } from '../config';

/**
 * Requests user orders from the back end.
 * Sample usage:
 * const {data:userOrders} = await getUserOrders(3);
 * if (userOrders) {
 *   Object.keys(userOrders).forEach(key => console.log(key, userOrders[key]));
 * }
 *
 * @param {*} limitToLast Limits how many of the last orders to return
 * @returns an object containing latest orders
 */
export const getUserOrders = async (limitToLast) =>
  functions().httpsCallable('userOrders')({ limitToLast });

export const createOrder = async (
  orderObj,
  setIsLoading,
  setVisible,
  ToastAndroid,
  orderDispatch,
  navigation
) => {
  setIsLoading(true);
  try {
    console.log('orderObj', orderObj);
    const resp = await functions().httpsCallable('orderCreate')(orderObj);
    const [orderId] = Object.keys(resp.data);
    orderDispatch({ type: 'CLEAR ADDRESSES' });
    navigation.navigate('Stack', {
      screen: 'Track Order',
      params: { id: orderId },
    });
  } catch (error) {
    console.error('order creation failed', error);
    if (Platform.OS === 'ios') {
      alert("Oops!! Can't create order");
    } else {
      ToastAndroid.showWithGravity(
        "Oops!! Can't create order",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
    }
  }
  setVisible(false);
  setIsLoading(false);
};

export const getSingleOrder = (orderId, setSingleOrder, setPolyLine) => {
  database()
    .ref(`orders/${orderId}`)
    .on('value', (snapshot) => {
      setSingleOrder(snapshot.val());
      // Decode poly path
      if (snapshot.val() && snapshot.val().poly !== undefined) {
        const decodePoly = decode(snapshot.val().poly, 5).map((coords) => ({
          latitude: coords[0],
          longitude: coords[1],
        }));
        setPolyLine(decodePoly);
      }
    });
};

export const cancelOrder = (orderId) => {
  database().ref(`orders/${orderId}`).off('value');
};

export const getOrder = async () => {
  try {
    const { uid } = auth().currentUser;

    const { data: userOrders } = await getUserOrders(3);

    let newOrderArr = []

    if (userOrders) {
      Object.keys(userOrders).forEach((key) => {
        const element = userOrders[key];
        if (element.uid === uid) {
          newOrderArr.push(element);
        }
      });
    }

    return { newOrderArr };

  } catch (error) {
    console.log('error', error);
    return { newOrderArr: [] };
  }
};

export const getOrderConfig = async () => {
  try {
    const snapshot = await database().ref('config').once('value');
    const configObj = snapshot.val();
    return configObj;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getLocationFromPlaceId = async (
  id,
  item,
  _route,
  setIsSearchPopUp,
  setNewCoords,
  setIsMapMovementFix,
  setAddress
) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const config = { method: 'GET', headers };
    // eslint-disable-next-line max-len
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=address_component,formatted_address,place_id,geometry,name,type,vicinity,plus_code&region=ca&key=${GOOGLE_PLACES_API_KEY}`;
    const response = await fetch(url, config);
    const data = await response.json();

    const {
      place_id: placeId,
      geometry: {
        location: { lat, lng },
      },
      address_components: addressComponents,
      // formatted_address: formattedAddress,
    } = data.result;

    const streetName = addressComponents.find((address) =>
      address.types.includes('route')
    );
    const countryCode = addressComponents.find((address) =>
      address.types.includes('country')
    );
    const city1 = addressComponents.find((address) =>
      address.types.includes('locality')
    );
    const city2 = addressComponents.find((address) =>
      address.types.includes('sublocality')
    );
    const postalCode = addressComponents.find((address) =>
      address.types.includes('postal_code')
    );
    const streetNumber = addressComponents.find((address) =>
      address.types.includes('street_number')
    );
    const provinceCode = addressComponents.find((address) =>
      address.types.includes('administrative_area_level_1')
    );
    const subcity = addressComponents.find((address) =>
      address.types.includes('administrative_area_level_2')
    );

    const address = {
      city: city1?.long_name || city2?.long_name,
      countryCode: countryCode?.short_name,
      id: placeId,
      lat,
      lng,
      name: item.locationName,
      postalCode: postalCode?.long_name || null,
      streetName: streetName?.long_name,
      provinceCode: provinceCode?.short_name,
      streetNumber: streetNumber?.long_name || null,
      subcity: subcity?.long_name,
      title: item.address,
      address: item.address,
    };
    setAddress(address);

    if (setIsSearchPopUp !== undefined) {
      setIsSearchPopUp(false);
    }
    setNewCoords(data.result.geometry.location);
    if (setIsMapMovementFix !== undefined) {
      setTimeout(() => {
        setIsMapMovementFix(true);
      }, 500);
    }
  } catch (error) {
    console.error(error);
  }
};
