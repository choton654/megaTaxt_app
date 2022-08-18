import React, { useContext, useCallback, useState } from 'react';
import { View, StyleSheet, Text, InteractionManager, Platform } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Divider } from "react-native-paper"
import Loader from '../components/Loader';
import { OrderContext } from '../context/OrderContext';
import Header from '../components/Header'
import { LayoutContext } from '../context/LayoutContext';

const SingleOrder = () => {
  const {
    params: { id },
  } = useRoute();
  const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false);
  const [orderTime, setOrderTime] = useState(null);
  const { state: orderState } = useContext(OrderContext);
  const { state: layoutState } = useContext(LayoutContext);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        let hours = new Date(orderState.singleOrder.createdAt).getHours();
        let minutes = new Date(orderState.singleOrder.createdAt).getMinutes();
        const suffix = hours >= 12 ? "PM" : "AM";
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        setOrderTime(
          `${new Date(orderState.singleOrder.createdAt).toDateString()} ${((hours + 11) % 12) + 1
          }:${minutes}${suffix}`
        );
        setDidFinishInitialAnimation(true);
      });
      return () => task.cancel();
    }, [orderState.singleOrder])
  );

  if (!didFinishInitialAnimation || !orderState.singleOrder) {
    return <Loader />;
  }

  return (
    <View style={{ backgroundColor: "#fff" }}>
      {Platform.OS === "ios" && (
        <Header title={layoutState.isEnglish ? layoutState.EN.ORDER : layoutState.FR.ORDER} />
      )}
      <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
        <Text style={styles.text1}>{orderState.singleOrder.orderedAt}</Text>
        <Text style={styles.text2}>{orderState.singleOrder.status}</Text>
      </View>
      <View style={{ borderWidth: 0.3, width: "96%", marginLeft: "auto", borderColor: "#bdbdbd" }} />

      <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
        <Text style={styles.text1}>From</Text>
        <Text style={styles.text2}>{orderState.singleOrder.addressFrom.address}</Text>
      </View>
      <View
        style={{
          borderWidth: orderState.singleOrder.addressTo ? 0.3 : 0.2,
          width: "96%",
          borderColor: "#bdbdbd",
          marginLeft: "auto",
        }}
      />

      {/* <Divider
        style={{
          borderWidth: 0.4,
          borderColor: colors.placeholder,
        }}
      /> */}
      {orderState.singleOrder.addressTo && (
        <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
          <Text style={styles.text1}>To</Text>
          <Text style={styles.text2}>{orderState.singleOrder.addressTo.address}</Text>
        </View>
      )}
      <View style={{ borderWidth: 0.4, width: "96%", marginLeft: "auto", borderColor: "#bdbdbd" }} />

      {/* <Divider
        style={{
          borderWidth: 0.4,
          borderColor: colors.placeholder,
        }}
      /> */}
      {orderState.singleOrder.driverInfo &&
        <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
          <Text style={styles.text1}>Driver</Text>
          <Text
            style={
              styles.text2
            }>{`${orderState.singleOrder.driverInfo.firstName} ${orderState.singleOrder.driverInfo.lastName}`}</Text>
        </View>
      }
      <View style={{ borderWidth: 0.3, width: "96%", marginLeft: "auto", borderColor: "#bdbdbd" }} />

      {/* <Divider
        style={{
          borderWidth: 0.4,
          borderColor: colors.placeholder,
        }}
      /> */}
      {orderState.singleOrder.vehicleInfo &&
        <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
          <Text style={styles.text1}>VEHICLE</Text>
          <Text style={styles.text2}>{orderState.singleOrder.vehicleInfo.category}</Text>
          <Text style={styles.text2}>{orderState.singleOrder.vehicleInfo.model}</Text>
        </View>
      }
      {/* <Divider
        style={{
          borderWidth: 0.6,
          borderColor: colors.placeholder,
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  text1: { fontFamily: "Roboto_400Regular" },
  text2: { fontFamily: "Roboto_500Medium", marginTop: 5 },
});

export default SingleOrder;
