//import 'firebase/firestore'; 
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
	apiKey: "AIzaSyB59_bZgAJLNBAdVtRGJXSZ0th0ZwBsZvo",
	authDomain: "bejamas-65d11.firebaseapp.com",
	projectId: "bejamas-65d11",
	storageBucket: "bejamas-65d11.appspot.com",
	messagingSenderId: "313996064177",
	appId: "1:313996064177:web:012985741ef903761df990"
  };
//export default firebase.initializeApp(firebaseConfig);
const FBapp = initializeApp(firebaseConfig);
const FBdb = getFirestore(FBapp);
const FBauth = getAuth();
const FBstorage = getStorage(FBapp);
export { FBapp, FBauth, FBdb, FBstorage };
