import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyDpJTPfHDQ80yu7ioWcOKJcXS_id6noAts",
    authDomain: "zland-india.firebaseapp.com",
    projectId: "zland-india",
    storageBucket: "zland-india.appspot.com",
    messagingSenderId: "1009896665642",
    appId: "1:1009896665642:web:d112e8c7558e5a7e520953",
    measurementId: "G-WPFNX1CT6G"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}