//import * as firebase from "firebase/app";
//import "firebase/firestore";
import { FBapp, FBauth, FBdb } from "../../firebase/firebaseConfig";
import { onAuthStateChanged, createUserWithEmailAndPassword, getIdToken, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { UserReg } from "../../screens/AuthScreens/authType";
import { signOut } from "firebase/auth";
import { SecureSave } from "../../utilities/helpers";
import { BASE_URL } from "../../utilities/constants";
//const { currentUser } = FBauth;
export const authenticateUser = () => {
  return new Promise(async (resolve, reject) => {
    // console.log("launching AuthenticatedUser in signup-functions", FBapp);
    if (!FBapp) return;
    try {
      onAuthStateChanged(FBauth, (user) => {
        if (user) {
          console.log("The user in AuthenticatedUser is logged in", user.uid);
          global.userID = user.uid;
          resolve({ data: user.uid, status: "SUCCESS", isSignedIn: true, msg: "user is signed in" });
        } else {
          console.log("The user is not logged in");
          resolve({ data: null, status: "SUCCESS", isSignedIn: false, msg: "user not signed in" });
        }
      });
    } catch (err) {
      reject({ data: null, status: "ERROR", isSignedIn: false, msg: "user cannot be authenticated" });
    }
  });
};
export const setUpUser = async (data: UserReg) => {
  //const { displayName, photoURL, email } = firebase.auth().currentUser;
  const signInData = {
    email: data.email,
    userID: data.userID, 
  }; 
  SecureSave("signInData", JSON.stringify(signInData));
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  await setDoc(doc(FBdb, "Users", data?.userID), {
    userID: data?.userID,
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    phoneNumber: data?.phoneNumber || "",
    photoURL: data?.photoURL || "",
    email: data?.email || "",
    joined: serverTimestamp(),
    cart:[]
  }); 
};
export const setUpNewUser = async (uid) => {
  const currentUser = FBauth.currentUser 
  const { displayName, photoURL, email } =  currentUser;
  await setDoc(doc(FBdb, "Users", data?.userID), {
    userID: uid, 
    firstName: displayName ||"",
    phoneNumber: "",
    lastName: "",
    photoURL: photoURL,
    email: email, 
    joined: serverTimestamp(),
    cart:[]
  });  
};
export const signup = async (payload: UserReg) => {
  return new Promise(async (resolve, reject) => {
    console.log("launching signup...");
    let user:any = null;
    try {
      createUserWithEmailAndPassword(FBauth, payload.email, payload.password)
        .then(async (res) => {
          console.log("login data is  ", res);
          const { currentUser } = FBauth;
          user = currentUser;
          const token = await getIdToken(currentUser, true);
          await sendEmailVerification(currentUser);
          global.userID = user?.uid;
          global.idToken = token;
          payload["userID"] = user?.uid;
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        })
        .then(async () => {
          await setUpUser(payload);
          resolve({ status: "SUCCESS", msg: "user successfully signed up", data: user?.uid });
        })
        .then(async () => { 
          await authenticateUser()
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == "auth/weak-password") {
            reject({ status: "ERROR", msg: "The password is too weak." });
          } else {
            reject({ status: "ERROR", msg: errorMessage });
          }
          console.log(error);
          reject({ status: "ERROR", msg: "ERROR" });
        });
    } catch (err) {
      console.log(error);
      reject({ status: "ERROR", msg: "unable to signup" });
    }
  });
};
 
export const login = async (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const r = await signInWithEmailAndPassword(FBauth, payload["email"], payload["password"]);
      if (r && r.user) {
        r.user.getIdToken().then(function (idToken) {
          console.log("token in firebase auth is: ", idToken);
          // It shows the Firebase token now
          const signInData = {
            email: r.user.email,
            userID: r?.user?.uid,
            idToken,
            // user: r?.user
          };
          SecureSave("signInData", JSON.stringify(signInData));
        });
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        global.userID = r?.user?.uid;
        resolve({ status: "SUCCESS", msg: "user successfully logged in", data: r?.user?.uid });
      } else {
        reject({ status: "ERROR", msg: "user unable to log in" });
        console.log(" r in signin error is ", r);
      }
    } catch (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == "auth/weak-password") {
        resolve({ status: "ERROR", msg: "The password is too weak." });
      } else {
        resolve({ status: "ERROR", msg: errorMessage });
      }
      console.log(error);
      reject({ status: "ERROR", msg: "ERROR" });
    }
  });
};

export const SignOut = () => {
  return new Promise(async (resolve, reject) => {
    try {
      signOut(FBauth);
      await SecureSave("signInData", "");
      global.userID = null;
      global.password = null;
      global.email = null;
      resolve({});
    } catch (error) {
      console.log("An error happened", error);
    }
  });
};
