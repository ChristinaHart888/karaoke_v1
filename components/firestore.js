import * as firebase from "firebase/app";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyAkQcjBu24LNd_wRR_o1CExlF2Jf02V4Oo",
	authDomain: "karaoke-v1-388007.firebaseapp.com",
	projectId: "karaoke-v1-388007",
	storageBucket: "karaoke-v1-388007.appspot.com",
	messagingSenderId: "1018350208584",
	appId: "1:1018350208584:web:7846894486a208b179fa7d",
	measurementId: "G-9KSK7DEV33",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const authen = getAuth(app);

export const fb = app;
export const firestore = db;
export const auth = authen;
