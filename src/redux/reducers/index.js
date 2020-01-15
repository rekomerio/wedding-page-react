import { combineReducers } from "redux";
import loadingState from "./loadingState";
import user from "./user";

export default combineReducers({ loadingState, user });
