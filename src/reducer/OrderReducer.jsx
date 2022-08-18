export const initialState = {
  addressFrom: null,
  addressTo: null,
  driverNote: null,
  isAddressFromShownToField: false,
  isAddressToShownToField: false,
  searchBarText: '',
  noteToDriver: '',
  paymentMethod: null,
  vehicle: null,
  moreOptions: {
    isCat: false,
    isDog: false,
    isCardoorOpen: false,
    isCarBoost: false
  },
  isMoreOptionShown: false,
  orderStatus: '',
  orderList: [],
  singleOrder: null,
  addressList: [],
  orderConfig: null,
  isRegionChange: false
};

export const reducer = (state, action) => {

  const { type, payload } = action

  switch (type) {
    case "ORDER":
      return {
        ...state,
        orderStatus: payload,
      };

    case "SET ORDER LIST":
      return {
        ...state,
        orderList: payload,
        // addressList: payload.addressArr,
      };

    case "SET RECENT ORDER LIST":
      return {
        ...state,
        addressList: Array.isArray(payload) ? payload : [...state.addressList, payload],
      };

    case "REMOVE RECENT ORDER":
      return {
        ...state,
        addressList: state.addressList.filter(item => item.createdAt !== payload),
      };

    case "SET REGIONCHANGE":
      return {
        ...state,
        isRegionChange: true,
      };

    case "SET ORDER CONFIG":
      return {
        ...state,
        orderConfig: payload,
      };

    case "SET DRIVER NOTE":
      return {
        ...state,
        driverNote: payload,
      };

    case "SET VEHICLE":
      return {
        ...state,
        vehicle: payload,
      };

    case "SET PAYMENT METHOD":
      return {
        ...state,
        paymentMethod: payload,
      };

    case "SET CAR OPTIONS":
      return {
        ...state,
        moreOptions: {
          ...state.moreOptions,
          [payload.key]: payload.value,
          // [payload]: !state.moreOptions[payload],
        },
      };

    case "CLEAR PAYMENT METHOD":
      return {
        ...state,
        paymentMethod: null,
      };

    case "CLEAR VEHICLE":
      return {
        ...state,
        vehicle: null,
      };

    case "CLEAR CAR OPTIONS":
      return {
        ...state,
        moreOptions: {
          isCat: false,
          isDog: false,
          isCardoorOpen: false,
          isCarBoost: false,
        },
      };
    case "SET SEARCHBAR TEXT":
      return {
        ...state,
        searchBarText: payload,
      };

    case "SET ADDRESS FROM":
      return {
        ...state,
        addressFrom: payload,
      };

    case "SET ADDRESS TO":
      return {
        ...state,
        addressTo: payload,
      };

    case "CLEAR ADDRESSES":
      return {
        ...state,
        addressFrom: null,
        addressTo: null,
      };

    case "SET SINGLE ORDER":
      return {
        ...state,
        singleOrder: payload,
      };

    case "SET ADDRESS-FROM SHOWN TO FIELD":
      return {
        ...state,
        isAddressFromShownToField: true,
      };

    case "SET ADDRESS-TO SHOWN TO FIELD":
      return {
        ...state,
        isAddressToShownToField: true,
      };
    case "SET ADDRESS-FROM HIDE":
      return {
        ...state,
        isAddressFromShownToField: false,
      };

    case "SET ADDRESS-TO HIDE":
      return {
        ...state,
        isAddressToShownToField: false,
      };
    case "REMOVE ADDRESS-FROM":
      return {
        ...state,
        isAddressFromShownToField: false,
      };

    case "REMOVE ADDRESS-TO":
      return {
        ...state,
        isAddressToShownToField: false,
      };

    case "MORE OPTION SHOWN":
      return {
        ...state,
        isMoreOptionShown: true,
      };

    case "MORE OPTION HIDDEN":
      return {
        ...state,
        isMoreOptionShown: false,
      };
    default:
      break;
  }
}