import * as firebase from "firebase/app";
import "firebase/firestore";
import { FBdb, FBstorage, FBauth } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"; 
import shorthash from "shorthash";
import { getMyProducts } from "../product-api/product-functions";
import { setUpUser, setUpNewUser } from "../auth/signup-functions";
export const getAllMyDetails = (uid) => {
  return new Promise(async (resolve, reject) => {
    const [BIO, PRODUCTS] = await Promise.all([
      getUserDetails(uid),
      getMyProducts(uid),
    ]);
    resolve({ msg: "SUCCESS", data: { BIO, PRODUCTS } });
  });
};

export const getUserDetails = (uid: string) => {
  return new Promise(async (resolve, reject) => {
    const docRef = doc(FBdb, "Users", uid);
    const docSnap = await getDoc(docRef);
    try {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const user = docSnap.data();
        if (user === undefined && uid == global.userID) {
          setUpNewUser(uid);
        }
        resolve(user);
      } else {
        console.log("No such document!");
        reject({ msg: "no user" });
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
