//language import 
import english from "../../assets/i18n/en.json"
import french from "../../assets/i18n/fr.json"

export const initialState = {
    isAccountFocused: false,
    isEnglish: true,
    EN: english,
    FR: french
};

export const reducer = (state, action) => {

    const { type, payload } = action

    switch (type) {
        case "CHANGE DRAWER LAYOUT":
            return {
                ...state,
                isAccountFocused: payload
            }
        case "CHANGE LANGUAGE":
            return {
                ...state,
                isEnglish: !state.isEnglish
            }
    }
}