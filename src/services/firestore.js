import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
    addDoc, arrayUnion, collection, doc, getDoc,
    getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, updateDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARW6d71u59L_NWUELfn5yi8kPi0jwwfsc",
  authDomain: "dayznotes-cdcbc.firebaseapp.com",
  projectId: "dayznotes-cdcbc",
  storageBucket: "dayznotes-cdcbc.appspot.com",
  messagingSenderId: "554593508248",
  appId: "1:554593508248:web:483f7e9f4590f8357029ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export const authenticateAnonymously = () => {
    return signInAnonymously(getAuth(app));
};

export const createGroceryList = (userName, userId) => {
    const groceriesColRef = collection(db, 'groceryLists')
    return addDoc(groceriesColRef, {
            created: serverTimestamp(),
            createdBy: userId,
            users: [{
                userId: userId,
                name: userName
            }]
        });
};

export const getGroceryList = (groceryListId) => {
    const groceryDocRef = doc(db, 'groceryLists', groceryListId)
    return getDoc(groceryDocRef);
};

export const getGroceryListItems = (groceryListId) => {
    const itemsColRef = collection(db, 'groceryLists', groceryListId, 'items')
    return getDocs(itemsColRef)
}

export const streamGroceryListItems = (groceryListId, snapshot, error) => {
    const itemsColRef = collection(db, 'groceryLists', groceryListId, 'items')
    const itemsQuery = query(itemsColRef, orderBy('created'))
    return onSnapshot(itemsQuery, snapshot, error);
};

export const addUserToGroceryList = (userName, groceryListId, userId) => {
    const groceryDocRef = doc(db, 'groceryLists', groceryListId)
    return updateDoc(groceryDocRef, {
            users: arrayUnion({
                userId: userId,
                name: userName
            })
        });
};

export const addGroceryListItem = (item, groceryListId, userId) => {
    return getGroceryListItems(groceryListId)
        .then(querySnapshot => querySnapshot.docs)
        .then(groceryListItems => groceryListItems.find(groceryListItem => groceryListItem.data().name.toLowerCase() === item.toLowerCase()))
        .then( (matchingItem) => {
            if (!matchingItem) {
                const itemsColRef = collection(db, 'groceryLists', groceryListId, 'items')
                return addDoc(itemsColRef, {
                        name: item,
                        created: serverTimestamp(),
                        createdBy: userId
                    });
            }
            throw new Error('duplicate-item-error');
        });
};