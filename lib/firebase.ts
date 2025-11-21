import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBQJ3D22gIDyzFHi_xJoGMhLc0ylMCXvp0",
    authDomain: "portfolio-2d2aa.firebaseapp.com",
    databaseURL: "https://portfolio-2d2aa-default-rtdb.firebaseio.com",
    projectId: "portfolio-2d2aa",
    storageBucket: "portfolio-2d2aa.appspot.com",
    messagingSenderId: "605508864160",
    appId: "1:605508864160:web:c71bbda7599bcce190a1c5",
    measurementId: "G-7WMZNR98RS",
};

export const unsplashConfig = {
    public_key: 'KEs_cV4oWxyDdP4diZCTvHbkWHriXp0CvhIMDA6MgRs',
    private_key: 'FHMYMSLHS5FUFrIg9pA-rs3iRS5DK_p1RuxLKrdSwLw',
    app_id: '820896',
    user_name: 'dsav96',
    url: 'https://api.unsplash.com/',
};

export const mapplsConfig = {
    api_key: 'jifsvjfjizyhvifgqxuaiinxwtklotnyejxe',
};

export const ppConfig = {
    api_key: '396bba7ab4554037813b5a86ac42dc25',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);