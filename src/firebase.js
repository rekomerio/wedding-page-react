import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import { firebaseConfig } from "./api_keys";

firebase.initializeApp(firebaseConfig);

export const functions = firebase.app().functions("europe-west1");
export const auth = firebase.auth();
export const storage = firebase.storage();
export const firestore = firebase.firestore();
export default firebase;
