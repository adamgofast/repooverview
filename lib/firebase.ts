// Firebase initialization - lazy loaded to prevent build-time execution
// This file should ONLY be imported by 'use client' components

import { initializeApp, getApps } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Lazy initialization - only runs in browser context
let app: ReturnType<typeof initializeApp> | undefined
let authInstance: Auth | undefined

function getFirebaseApp() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized in browser context')
  }
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  }
  return app
}

export function getAuthInstance(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth can only be used in browser context')
  }
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp())
  }
  return authInstance
}

// Export auth as a getter to prevent build-time execution
export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    return getAuthInstance()[prop as keyof Auth]
  }
})

