// Firebase Client SDK - CLIENT-ONLY
// This file should ONLY be imported by 'use client' components
// DO NOT import Firebase modules at top level - they will execute during build

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Lazy initialization function - call this in components, not at module level
let app: any
let authInstance: any
let googleProvider: any

export async function getAuth() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized in browser context')
  }
  if (!authInstance) {
    const { initializeApp, getApps } = await import('firebase/app')
    const { getAuth: getAuthFn } = await import('firebase/auth')
    
    if (!app) {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    }
    authInstance = getAuthFn(app)
  }
  return authInstance
}

export async function getGoogleProvider() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized in browser context')
  }
  if (!googleProvider) {
    const { GoogleAuthProvider } = await import('firebase/auth')
    googleProvider = new GoogleAuthProvider()
  }
  return googleProvider
}

export async function signInWithGoogle() {
  const { signInWithPopup } = await import('firebase/auth')
  const auth = await getAuth()
  const provider = await getGoogleProvider()
  const result = await signInWithPopup(auth, provider)
  const user = result.user

  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    photoURL: user.photoURL,
  }
}

