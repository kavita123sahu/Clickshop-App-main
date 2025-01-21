import { combineReducers } from "redux";
import darkmode_reducer from "./DarkModeReducer";
import user_info_reducer from "./UserInfoReducer";
import cart_info_reducer from './CartReducer';
import CartAddedReducer from "./CartAddedReducer";
import internetReducer from "./InternetReducer";

export default combineReducers({
    darkmode_reducer,
    user_info_reducer,
    cart_info_reducer,
    CartAddedReducer,
    internetReducer
})