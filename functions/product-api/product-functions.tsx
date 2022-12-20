import 'firebase/firestore';
import {
 addDoc,
 arrayUnion,
 collection,
 doc,
 getDoc,
 getDocs,
 query,
 serverTimestamp,
 setDoc,
 updateDoc,
 where,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import shorthash from 'shorthash';
import { FBauth, FBdb } from '../../firebase/firebaseConfig';
// Create a root reference// Create a root reference
const storage = getStorage();
//const storage = firebase.storage();

/**
* @description: fetches all products from the firebase database under the document named "Products"
* @returns all products from database
*/
export const fetch_all_products = async () => {
 return new Promise(async (resolve, reject) => {
   console.log('launching fetch_all_products...');
   let user = null;
   try {
     const q = query(collection(FBdb, 'Products'));
     let data: Object[] = [];
     const querySnapshot = await getDocs(q);
     querySnapshot.forEach((doc) => {
       data = [...data, { id: doc.id, ...doc.data() }];
     });
     resolve({
       data: data.sort((a, b) => {
         return b.createdAt - a.createdAt;
       }),
       msg: 'SUCCESS',
     });
   } catch (err) {
     console.log(err);
     reject({ status: 'ERROR', msg: 'unable to signup' });
   }
 });
};

/**
* @description - adds product asynchronously to cart contents
* @params - id:string - product identifier
* @return either message of success on success or message error on failure
*/
export const add_to_my_cart = async (id: string) => {
 return new Promise(async (resolve, reject) => {
   console.log('updating cart...');
   try {
     setDoc(
       doc(FBdb, 'Users', global.userID),
       {
         cart: arrayUnion(id),
       },
       { merge: true },
     )
       .then(() => resolve({ msg: 'SUCCESS' }))
       .catch((err) => {
         console.error(err);
         reject({ err, msg: 'ERROR' });
       });
   } catch (err) {
     console.log(err);
     reject({ status: 'ERROR', msg: 'unable to update cart!' });
   }
 });
};

/**
* @description - update product asynchronously to cart contents
* @params - id:string - product identifier
* @return either updated product on success or error on failure
*/
export const update_my_cart = async (id: string) => {
 return new Promise(async (resolve, reject) => {
   console.log('removing cart...');
   try {
     const docRef = doc(FBdb, 'Users', global.userID);
     const docSnap = await getDoc(docRef);
     console.log('Document data:', docSnap.data());
     let data: any = docSnap.data();
     let cart = data?.cart || [];
     if (data?.cart.includes(id)) {
       let newCart = cart.filter((item: string) => {
         if (item != id) return true;
       });
       updateDoc(docRef, {
         cart: newCart,
       }).then(() => {
         resolve({ msg: 'SUCCESS', cart, data });
       });
     } else {
       updateDoc(docRef, {
         cart: arrayUnion(id),
       }).then(() => {
         resolve({ msg: 'SUCCESS', cart, data });
       });
     }
   } catch (err) {
     console.log(err);
     reject({ status: 'ERROR', msg: 'unable to update cart!' });
   }
 });
};
/**
* @description gets the image url and name
* @params file blob
* @params image - image uri
* @returns image path and image names
*/
export const uploadProductImage = (file, image) => {
 return new Promise(async (resolve, reject) => {
   try {
     let name = '';
     let url = '';
     const uid = FBauth.currentUser?.uid;
     const path = `Products/${uid}/${uid}-${shorthash.unique(
       image.uri,
     )}.${image.uri.split('.').pop()}`;
     const storageRef = ref(storage, path);
     uploadBytes(storageRef, file)
       .then(async (snapshot) => {
         name = snapshot.metadata.name;
         url = await getDownloadURL(storageRef);
         console.log('getdownload url... ', url);
       })
       .then(() => {
         resolve({ url: url, name: name });
       });
   } catch (err) {
     reject(err);
   }
 });
};

const uploadImage = async (result) => {
 console.log('result imageobj is:  ', result);
 return new Promise(async (resolve, reject) => {
   if (!result || !result?.uri) {
     return reject(new Error('no image added, pls try again later!'));
   }
   const response = await fetch(result.uri);
   console.log('response imageobj is:  ', response);
   const blob = await response.blob();
   console.log('blob is:  ', blob);
   uploadProductImage(blob, result)
     .then((res) => {
       let { url, image } = res;
       resolve({ imgUrl: url });
     })
     .catch((err) => {
       console.log(err);
       reject({ msg: 'ERROR', err: err });
     });
 });
};

/**
* @description checks user authentication, validates product and adds the valid product to firebase 'Products' collection
* @returns message of success on success or error invalid product and user
*/
export const createProduct = async (product: Object) => {
 console.log('product received is ', product);
 return new Promise(async (resolve, reject) => {
   const user = FBauth.currentUser.uid;
   console.log('user.uid is ', user);
   if (!user) {
     return reject(
       new Error('cannot authenticate the user, pls try again later!'),
     );
   }
   if (product === undefined) {
     return reject(new Error('No product!'));
   }
   if (
     !product?.name ||
     !product?.description ||
     !product?.price ||
     !product?.category ||
     !product?.productImage ||
     !product?.amount
   ) {
     return reject(new Error('Incomplete product details...'));
   }
   if (!product?.productImage) {
     return reject(new Error('No image provided..'));
   }
   uploadImage(product.productImage)
     .then(async (doc) => {
       console.log('doc from image upload... ', doc);
       addDoc(collection(FBdb, 'Products'), {
         name: product.name,
         description: product.description,
         price: product.price,
         product: product.category,
         image: doc?.imgUrl || '',
         author_uid: global.userID,
         amount: product?.amount || 1,
         createdAt: serverTimestamp(),
       })
         .then(() => resolve({ msg: 'SUCCESS' }))
         .catch((err) => {
           console.log(err);
           reject({ msg: 'ERROR', err: err });
         });
     })
     .catch((err) => {
       console.log(err);
       reject({ msg: 'ERROR', err: err });
     });
 });
};

/**
* @description buy items in products
* @params id: string - product identify
*/
export const buyProduct = async (id: string) => {
 console.log('product received is ', id);
 return new Promise(async (resolve, reject) => {
   const user = FBauth.currentUser.uid;
   console.log('user.uid is ', user);
   if (!user) {
     return reject(
       new Error('cannot authenticate the user, pls try again later!'),
     );
   }
   if (!id) {
     return reject(new Error('cannot product id, pls try again later!'));
   }
   try {
     const docRef = doc(FBdb, 'Products', id);
     const docSnap = await getDoc(docRef);
     console.log('Document data:', docSnap.data());
     let data: any = docSnap.data();
     let cart = data?.cart || [];
     if (data?.amount > 0) {
       updateDoc(docRef, {
         amount: data.amount - 1,
       }).then(() => {
         resolve({ msg: 'SUCCESS', data });
       });
     } else {
       resolve({ msg: 'OUT OF STOCK', data });
     }
   } catch (err) {
     console.log(err);
     reject({ status: 'ERROR', msg: 'unable to buy product!' });
   }
 });
};

/**
* @description gets product from users carts
* @return list of products in users carts
*/
export const getMyProducts = (uid: string) => {
 return new Promise(async (resolve, reject) => {
   let Products: Array<Object> = [];
   try {
     const q = query(
       collection(FBdb, 'Products'),
       where('author_uid', '==', uid),
     );
     const querySnapshot = await getDocs(q);
     querySnapshot.forEach((doc) => {
       // doc.data() is never undefined for query doc snapshots
       console.log(doc.id, ' => ', doc.data());
       Products.push({ id: doc.id, ...doc.data() });
     });
     resolve(Products);
   } catch (err) {
     reject({ err });
   }
 });
};























