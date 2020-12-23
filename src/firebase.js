import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAwT8qCgvv7RKFkSMKfOe3zlMbgiw54uTM",
  authDomain: "auth-development-7136f.firebaseapp.com",
  databaseURL: "https://auth-development-7136f-default-rtdb.firebaseio.com",
  projectId: "auth-development-7136f",
  storageBucket: "auth-development-7136f.appspot.com",
  messagingSenderId: "1044741522096",
  appId: "1:1044741522096:web:2cac8bc4e2e33f6a37f175"
};
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();


export default firebase;  
