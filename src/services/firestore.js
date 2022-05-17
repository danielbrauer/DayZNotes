import { getAuth, signInAnonymously } from "firebase/auth";
import {
    addDoc, arrayUnion, collection, doc, getDoc,
    getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, updateDoc
} from "firebase/firestore";
import app from './firebase';

const db = getFirestore(app)

export const authenticateAnonymously = () => {
    return signInAnonymously(getAuth(app));
};

export const createPage = (userName, userId) => {
    const pagesColRef = collection(db, 'pages')
    return addDoc(pagesColRef, {
            created: serverTimestamp(),
            createdBy: userId,
            users: [{
                userId: userId,
                name: userName
            }]
        });
};

export const getPage = (pageId) => {
    const pageDocRef = doc(db, 'pages', pageId)
    return getDoc(pageDocRef);
};

export const getTimers = (pageId) => {
    const timersColRef = collection(db, 'pages', pageId, 'timers')
    return getDocs(timersColRef)
}

export const streamPageTimers = (pageId, snapshot, error) => {
    const timersColRef = collection(db, 'pages', pageId, 'timers')
    const timersQuery = query(timersColRef, orderBy('created'))
    return onSnapshot(timersQuery, snapshot, error);
};

export const addUserToPage = (userName, pageId, userId) => {
    const pageDocRef = doc(db, 'pages', pageId)
    return updateDoc(pageDocRef, {
            users: arrayUnion({
                userId: userId,
                name: userName
            })
        });
};

export const addTimer = (timerDesc, timerLength, pageId, userId) => {
    return getTimers(pageId)
        .then(querySnapshot => querySnapshot.docs)
        .then(timers => timers.find(timer => timer.data().name.toLowerCase() === timerDesc.toLowerCase()))
        .then( (matchingItem) => {
            if (!matchingItem) {
                const itemsColRef = collection(db, 'pages', pageId, 'timers')
                return addDoc(itemsColRef, {
                        name: timerDesc,
                        length: timerLength,
                        created: serverTimestamp(),
                        createdBy: userId
                    });
            }
            throw new Error('duplicate-item-error');
        });
};