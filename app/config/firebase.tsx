import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import Constants from 'expo-constants';

const firebaseConfig = {
    apiKey: Constants.manifest.extra.apiKey,
    authDomain: Constants.manifest.extra.authDomain,
    projectId: Constants.manifest.extra.projectId,
    storageBucket: Constants.manifest.extra.storageBucket,
    messagingSenderId: Constants.manifest.extra.messagingSenderId,
    appId: Constants.manifest.extra.appId,
    measurementId: Constants.manifest.extra.measurementId
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
export const storage = getStorage();
