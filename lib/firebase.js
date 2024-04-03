// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  where,
  getDocs,
  query,
  limit,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjQcVOS1dmXka_68_1TI-kHa2iMtpD8io",
  authDomain: "jordanhill-pupils.firebaseapp.com",
  projectId: "jordanhill-pupils",
  storageBucket: "jordanhill-pupils.appspot.com",
  messagingSenderId: "39164434116",
  appId: "1:39164434116:web:a4105da33ec4d3207edb91",
  measurementId: "G-Z3MH76FC6N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const googleAuthProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const STATE_CHANGED = "state_changed";

// Helper functions

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const q = query(
    collection(firestore, "users"),
    where("username", "==", username),
    limit(1)
  );
  const userDoc = (await getDocs(q)).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function commentToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data?.createdAt.toMillis() || 0,
  };
}
