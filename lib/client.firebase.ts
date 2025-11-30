/**
 * Firebase Client SDK - CLIENT-ONLY
 * 
 * ⚠️ Only import this in client components (files with 'use client')
 * Never use in server routes or API handlers
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSZtWajE1Twela0HS8clykCb7IxHQhmCg",
  authDomain: "truenorth-29011.firebaseapp.com",
  projectId: "truenorth-29011",
  storageBucket: "truenorth-29011.firebasestorage.app",
  messagingSenderId: "350386907594",
  appId: "1:350386907594:web:cc62bccfc9d86e23cbc733",
  measurementId: "G-49Y7F6J5YG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Auth and Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

