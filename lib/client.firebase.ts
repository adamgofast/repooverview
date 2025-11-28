/**
 * Firebase Client SDK - CLIENT-ONLY
 * 
 * ⚠️ Only import this in client components (files with 'use client')
 * Never use in server routes or API handlers
 */

// Firebase config - accessed at module level
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
}

// Lazy initialization - only when needed and in browser
let firebaseApp: any = null
let auth: any = null
let googleProvider: any = null

async function initializeFirebase() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized in browser context')
  }

  // Validate config
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.authDomain) {
    throw new Error('Firebase configuration is incomplete. Please check your environment variables.')
  }

  // Initialize if not already done
  if (!firebaseApp || !auth) {
    const { initializeApp, getApps } = await import('firebase/app')
    const { getAuth: getAuthFn } = await import('firebase/auth')
    
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuthFn(firebaseApp)
  }

  if (!googleProvider) {
    const { GoogleAuthProvider } = await import('firebase/auth')
    googleProvider = new GoogleAuthProvider()
  }

  return { auth, googleProvider }
}

export async function getAuth() {
  if (!auth) {
    await initializeFirebase()
  }
  return auth
}

export async function getGoogleProvider() {
  if (!googleProvider) {
    await initializeFirebase()
  }
  return googleProvider
}

export async function signInWithGoogle() {
  if (typeof window === 'undefined') {
    throw new Error('signInWithGoogle can only be called on the client')
  }
  
  const { signInWithPopup } = await import('firebase/auth')
  const { auth: authInstance, googleProvider: provider } = await initializeFirebase()
  
  const result = await signInWithPopup(authInstance, provider)
  const user = result.user

  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    photoURL: user.photoURL,
  }
}

