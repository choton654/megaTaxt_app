import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from "../../context/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { OrderContext } from "../../context/OrderContext";
import { useRoute } from "@react-navigation/native";
import { getLocationFromPlaceId } from "../../functions/order";

const SearchItem = ({
  idx,
  item,
  colors,
  setNewCoords,
  setIsSearchPopUp,
  setisMapmovementFix,
  recent,
  length,
  setAddess,
}) => {
  const route = useRoute();
  const { dispatch: authDispatch } = useContext(AuthContext);
  const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext);

  const locationFrom = () => {
    getLocationFromPlaceId(
      item.place_id,
      item,
      route,
      setIsSearchPopUp,
      setNewCoords,
      setisMapmovementFix,
      setAddess,
    );
    authDispatch({ type: "SET FORMATTED ADDRESS", payload: [] });
    orderDispatch({ type: "SET SEARCHBAR TEXT", payload: "" });
  };

  return (
    <View>
      <TouchableOpacity style={styles.address} onPress={locationFrom}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "95%",
            justifyContent: "space-between",
          }}>
          {recent ? (
            <MaterialCommunityIcons
              name='clock-time-nine-outline'
              size={25}
              color={colors.myOwnColor}
              style={{ marginLeft: 15 }}
            />
          ) : (
            <Ionicons name='location-outline' size={25} color={colors.myOwnColor} style={{ marginLeft: 15 }} />
          )}
          <View style={{ width: "80%" }}>
            <Text style={{ fontSize: 15 }}>{item.locationName}</Text>
            <Text style={{ marginTop: 5 }}>
              {item.address.split(",")[1].trim()},{item.address.split(",")[2]},{item.address.split(",")[3]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {!(idx === length - 1) && (
        <View
          style={{
            borderWidth: 0.4,
            width: "80%",
            marginLeft: "auto",
            borderColor: "#bdbdbd",
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  address: {
    // marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    // borderWidth: 1,
    // borderBottomWidth: 0.8,
    // borderBottomColor: "#bdbdbd"
  },
});


export default SearchItem