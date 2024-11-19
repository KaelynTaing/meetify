// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyArNE2l1cvcenWUhDkAKRarnaLgdrbWr5Q",

  authDomain: "meetify-e2040.firebaseapp.com",

  projectId: "meetify-e2040",

  storageBucket: "meetify-e2040.firebasestorage.app",

  messagingSenderId: "594468852739",

  appId: "1:594468852739:web:8c373f16585dae3ed9aa36",

  measurementId: "G-FCBBDTHX62"

};


// Initialize Firebase

export const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);