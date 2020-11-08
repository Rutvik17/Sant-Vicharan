import { combineReducers } from "redux";
import currentUserReducer from "./Users";
import permissions from "./Permissions";

const allReducers = combineReducers({
    currentUser: currentUserReducer,
    permissions: permissions
});

export default allReducers;
