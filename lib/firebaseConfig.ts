"use client";

// Import modul Firebase yang dibutuhkan
import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Ambil konfigurasi dari environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Modul Firebase yang sering digunakan
const auth = getAuth(app);
const db = getFirestore(app);

// Inisialisasi analytics hanya jika didukung

let analytics: Analytics | null = null;

const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Analytics initialized");
    } else {
      console.log("Analytics not supported in this environment");
    }
  }
};

initAnalytics();

export { app, auth, db, analytics };
