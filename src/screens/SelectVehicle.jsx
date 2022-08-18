import { View, StyleSheet, InteractionManager, Platform } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "react-native-paper"
import RadioGroup from 'react-native-radio-buttons-group'
import Loader from '../components/Loader'
import { OrderContext } from '../context/OrderContext'
import Header from '../components/Header'
import { LayoutContext } from '../context/LayoutContext'


const SelectVehicle = () => {

    const navigation = useNavigation()
    const { colors } = useTheme()
    const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext)
    const { state: layoutState } = useContext(LayoutContext)

    const preferredVehicle = [
        layoutState.isEnglish ? layoutState.EN.vehicleAny : layoutState.FR.vehicleAny,
        layoutState.isEnglish ? layoutState.EN.vehicleCarStationWagon : layoutState.FR.vehicleCarStationWagon,
        layoutState.isEnglish ? layoutState.EN.vehicleMinivan : layoutState.FR.vehicleMinivan
    ]

    const radioButtonsData = preferredVehicle.map((item, idx) =>
    ({
        id: idx,
        label: item,
        value: item,
        containerStyle: {
            ...styles.radioButtonsStyle,
            borderBottomWidth: idx === preferredVehicle.length - 1 ? 0 : 1
        },
        labelStyle: styles.labelStyle,
        borderColor: colors.myOwnColor,
        color: colors.myOwnColor,
        size: 15,
        selected: item === orderState.vehicle
    }))

    const [radioButtons, setRadioButtons] = useState(radioButtonsData)

    const onPressRadioButton = (radioButtonsArray) => {
        setRadioButtons(radioButtonsArray)
        const selectedVehicle = radioButtonsArray.find((item) => item.selected)
        orderDispatch({ type: "SET VEHICLE", payload: selectedVehicle.value })
        setTimeout(() => {
            navigation.goBack()
        }, 100)
    }

    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setDidFinishInitialAnimation(true)
        })
    }, [])

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={{ flex: 1, backgroundColor: colors.primary }}>
            {Platform.OS === "ios" &&
                <Header title={layoutState.isEnglish ? layoutState.EN.selectVehicle : layoutState.FR.selectVehicle} />
            }
            <RadioGroup
                radioButtons={radioButtons}
                containerStyle={{ padding: 10 }}
                onPress={onPressRadioButton}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    radioButtonsStyle: {
        alignItems: "center",
        width: '100%',
        height: 40,
        paddingLeft: 5,
        marginTop: 0,
        borderBottomColor: "#bdbdbd",
        flexDirection: "row-reverse",
        justifyContent: "space-between"
    },
    labelStyle: {
        fontSize: 15,
    }
})

export default SelectVehicle