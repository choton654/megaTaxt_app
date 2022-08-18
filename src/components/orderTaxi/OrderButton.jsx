/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import {
  View, TouchableOpacity, StyleSheet, Alert, ToastAndroid, ActivityIndicator,
  Platform
} from 'react-native';
import React, { useContext, useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Text, Portal, Dialog, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import { OrderContext } from '../../context/OrderContext';
import { createOrder } from '../../functions/order';
import { LayoutContext } from '../../context/LayoutContext';

const styles = StyleSheet.create({
  button: {
    borderRadius: 5, alignItems: 'center',
    height: 55, width: '90%', marginTop: 30,
    flexDirection: 'row', paddingHorizontal: 15,
    marginLeft: 'auto', marginRight: 'auto',
    justifyContent: 'space-between',
    elevation: 3,
  }
});

function OrderButton({ estimation }) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext);
  const { state: layoutState } = useContext(LayoutContext);
  const { driverNote, addressFrom, addressTo, paymentMethod, vehicle, moreOptions, orderConfig } = orderState;

  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [orderObj, setOrderObj] = useState(null);

  const lang = layoutState.isEnglish ? 'EN' : 'FR';

  const orderTaxi = useCallback(() => {
    if (auth().currentUser && auth().currentUser.phoneNumber) {
      if (addressFrom && estimation) {
        const order = {
          addressFrom,
          addressTo,
          passengerInfo: {
            email: auth().currentUser.email,
            name: auth().currentUser.displayName,
            phone: auth().currentUser.phoneNumber,
          },
          numPassengers: 1,
          notes: null,
          options: null,
          lang: lang.toLocaleLowerCase(),
          estimation,
        };
        setOrderObj(order);
        setVisible(true);
      } else if (!addressFrom) {
        if (Platform.OS === 'ios') {
          alert(layoutState[lang].missingDestination);
        } else {
          ToastAndroid.showWithGravity(layoutState[lang].missingDestination, ToastAndroid.LONG, ToastAndroid.CENTER);
        }
      }
    } else {
      Alert.alert(
        layoutState[lang].LOGIN,
        layoutState[lang].SIGNIN_TO_ORDER_TAXI,
        [
          {
            text: 'No',
            onPress: () => console.log('Ask me later pressed'),
            style: 'destructive',
          },
          {
            text: 'Yes',
            onPress: () => navigation.navigate('Drawer', { screen: 'Sign In' }),
            style: 'cancel',
          },
        ]
      );
    }
  }, [addressFrom, addressTo, estimation]);

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.button, opacity: isLoading ? 0.7 : 1 }]}
        onPress={orderTaxi}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size={30} color="#FFF" style={{ marginLeft: 10 }} />
        ) : (
          <Text
            style={{
              fontSize: layoutState.isEnglish ? 22 : 18,
              fontWeight: '700',
              color: colors.primary,
            }}>
            {layoutState[lang].ORDER_TAXI}

          </Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
          <View>
            <Text style={{ color: colors.primary, fontSize: 12 }}>
              {layoutState[lang].startingFrom}
            </Text>
            {estimation ?
              <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}>
                ${estimation.totalEstimatedCostMax.toFixed(2)} - ${estimation.totalEstimatedCostMin.toFixed(2)}
              </Text>
              :
              <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}>
                ${orderConfig?.taxiFare.fixed || '4.55'}**
              </Text>
            }
          </View>
          <Ionicons name='arrow-forward' size={25} color={colors.primary} style={{ marginLeft: 5 }} />
        </View>
      </TouchableOpacity>
      <Text
        style={{
          width: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 10,
          fontFamily: 'Roboto_400Regular',
          textAlign: 'left',
        }}>
        ** {layoutState[lang].faresDisclaimer}
      </Text>
      <Portal>
        <Dialog visible={visible} dismissable={false} onDismiss={() => setVisible(false)}>
          <Dialog.Title style={{ fontSize: 25, fontFamily: 'Roboto_500Medium' }}>
            {layoutState[lang].ORDER_TAXI}
          </Dialog.Title>
          <Dialog.Content style={{ paddingBottom: 10 }}>
            <View>
              <Text style={{ fontSize: 16, fontFamily: 'Roboto_500Medium', color: '#71717a' }}>
                {layoutState.isEnglish ? 'From' : 'De'}:{'   '}
                <Text style={{ color: '#a1a1aa' }}>{orderObj?.addressFrom.title}</Text>
              </Text>
              {orderObj?.addressTo && (
                <View style={{ marginTop: 15 }}>
                  <Text style={{ fontSize: 16, fontFamily: 'Roboto_500Medium', color: '#71717a' }}>
                    {layoutState.isEnglish ? 'To' : 'À'}:{'    '}
                    <Text style={{ color: '#a1a1aa' }}>{orderObj?.addressTo.title}</Text>
                  </Text>
                </View>
              )}
              {driverNote &&
                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                  <Text style={{ fontSize: 16, fontFamily: 'Roboto_500Medium', color: '#71717a' }}>
                    {layoutState[lang].NOTES}:{'  '}
                    <Text style={{ marginLeft: 8, color: '#a1a1aa' }}>{driverNote}</Text>
                  </Text>
                </View>
              }
              {vehicle && (
                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                  <Text style={{ fontSize: 16, fontFamily: 'Roboto_500Medium', color: '#71717a' }}>
                    {layoutState[lang].vehicle}:{'  '}
                    <Text style={{ marginLeft: 8, color: '#a1a1aa' }}>{vehicle}</Text>
                  </Text>
                </View>
              )}
              {paymentMethod && (
                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                  <Text style={{ fontSize: 16, fontFamily: 'Roboto_500Medium', color: '#71717a' }}>
                    {layoutState[lang].payInCarBy}:{'  '}
                    <Text style={{ marginLeft: 8, color: '#a1a1aa' }}>{paymentMethod}</Text>
                  </Text>
                </View>
              )}
              {Object.values(moreOptions).includes(true) && (
                <View style={{ marginTop: 15 }}>
                  <Text style={{ fontSize: 16, fontFamily: 'Roboto_500Medium', color: '#71717a' }}>
                    {layoutState[lang].OPTIONS}:{'  '}
                    <Text style={{ marginLeft: 8, color: '#a1a1aa' }}>
                      {moreOptions.isCat ? layoutState[lang].animalCat : ''}
                      {moreOptions.isCat && (moreOptions.isDog || moreOptions.isCardoorOpen || moreOptions.isCarBoost) && ', '}
                      {moreOptions.isDog ? layoutState[lang].animalDog : ''}
                      {moreOptions.isDog && (moreOptions.isCardoorOpen || moreOptions.isCarBoost) && ', '}
                      {moreOptions.isCardoorOpen ? layoutState[lang].servicesOpeningDoor : ''}
                      {moreOptions.isCardoorOpen && moreOptions.isCarBoost && ', '}
                      {moreOptions.isCarBoost ? layoutState[lang].servicesCarBoost : ''}
                    </Text>
                  </Text>
                </View>
              )}
            </View>
            <Dialog.Actions style={{ marginTop: 10, paddingBottom: 0 }}>
              <Button
                mode='text'
                color={colors.myOwnColor}
                loading={isLoading}
                onPress={() => setVisible(false)}
                style={{ marginRight: 20 }}>
                {layoutState[lang].NO}
              </Button>
              <Button
                mode='text'
                color={colors.myOwnColor}
                loading={isLoading}
                onPress={() =>
                  createOrder(orderObj, setIsLoading, setVisible, ToastAndroid, orderDispatch, navigation)
                }>
                {layoutState[lang].YES}
              </Button>
            </Dialog.Actions>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
}

OrderButton.propTypes = {
  estimation: PropTypes.shape({
    totalDuration: PropTypes.number,
    totalDurationHumanized: PropTypes.string,
    totalDistance: PropTypes.number,
    totalDistanceKm: PropTypes.string,
    fixedCost: PropTypes.number,
    distanceCost: PropTypes.number,
    timeCost: PropTypes.number,
    totalEstimatedCost: PropTypes.number,
    totalEstimatedCostMin: PropTypes.number,
    totalEstimatedCostMax: PropTypes.number,
  }),
};

OrderButton.defaultProps = {
  estimation: null
};

export default OrderButton;
