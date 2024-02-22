// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDy_vZ1MbL6J9tOBEh8Mj03AoRBIlDLb6U",
  authDomain: "telomap-f82b9.firebaseapp.com",
  projectId: "telomap-f82b9",
  storageBucket: "telomap-f82b9.appspot.com",
  messagingSenderId: "825644659094",
  appId: "1:825644659094:web:fcd173eac73dbe6651edb7",
  measurementId: "G-W3YMKVMXR9"
};

// Initialize Firebase
export const initFirebase = initializeApp(firebaseConfig);
export const db = getFirestore(initFirebase);
export const storage = getStorage(initFirebase);
export const auth = initializeAuth(initFirebase, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
