import { Timestamp } from "@firebase/firestore";

export type UserReg = {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    userID: string,
    phoneNumber: string,
    photoURL: string,
    joined: Timestamp
  };
  