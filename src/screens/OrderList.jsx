import React, { useContext, useState, useCallback } from 'react'
import { View, Text, InteractionManager, StyleSheet, FlatList } from 'react-native'
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { MaterialIcons } from "@expo/vector-icons";
import { List, useTheme } from "react-native-paper";
import Loader from "../components/Loader";
import { LayoutContext } from "../context/LayoutContext";
import { OrderContext } from "../context/OrderContext";

const OrderList = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { state: layoutState, dispatch: layoutDispatch } = useContext(LayoutContext);
  const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext);
  const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false);

  const getSingleOrder = useCallback(
    item => {
      orderDispatch({ type: "SET SINGLE ORDER", payload: { ...item, orderedAt: orderTime(item) } });
      navigation.navigate("Stack", {
        screen: "Order",
        params: { id: item.callbackId },
      });
    },
    [orderState.singleOrder]
  );

  const orderTime = useCallback(item => {
    let hours = new Date(item.createdAt).getHours();
    let minutes = new Date(item.createdAt).getMinutes();
    const suffix = hours >= 12 ? "PM" : "AM";
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${new Date(item.createdAt).toDateString()} ${((hours + 11) % 12) + 1}:${minutes}${suffix}`;
  }, []);

  const renderItem = useCallback(({ item }) => {
    return (
      <List.Accordion
        style={{
          backgroundColor: colors.primary,
          borderColor: colors.placeholder,
        }}
        onPress={() => getSingleOrder(item)}
        title={`${item.status}-${orderTime(item)}`}
        description={item.addressFrom.title}
        titleStyle={{ color: colors.dark, fontSize: 15, fontFamily: "Roboto_500Medium" }}
        expanded={false}
        right={({ isExpanded }) => (
          <MaterialIcons name='arrow-forward-ios' size={20} style={{}} color={colors.dark} />
        )}
      />
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(async () => {
        layoutDispatch({ type: "CHANGE DRAWER LAYOUT", payload: false });
        setDidFinishInitialAnimation(true);
      })
      return () => task.cancel();
    }, [])
  );

  if (!didFinishInitialAnimation) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      {orderState.orderList.length > 0 ? (
        <FlatList
          data={orderState.orderList}
          renderItem={renderItem}
          keyExtractor={(_, idx) => idx}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}>
          <Text style={{
            fontSize: 20, fontWeight: "700",
            color: colors.placeholder, padding: 10, textAlign: "center"
          }}>
            {layoutState.isEnglish ? "You haven't orderd any taxi yet" : "Vous n'avez pas encore commandé de taxi"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",

  }
})

export default OrderList