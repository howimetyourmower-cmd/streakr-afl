// app/_firebaseClient.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID!,
};

// Create (or reuse) a singleton Firebase App for the client
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(cfg);

// Export **both** named and default so either import style works
export { app };
export default app;
