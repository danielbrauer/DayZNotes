import { getAuth, signInAnonymously } from "firebase/auth";
import {
    addDoc, arrayUnion, collection, deleteDoc, doc, getDoc,
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

export const addTimer = async (timerDesc, timerLength, pageId, userId) => {
    const snapshot = await getTimers(pageId)
    const timers = await snapshot.docs
    const matchingItem = await timers.find(timer => timer.data().name.toLowerCase() === timerDesc.toLowerCase())
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
};

export const resetTimer = async (pageId, timerId) => {
    const timerDocRef = doc(db, 'pages', pageId, 'timers', timerId)
    return updateDoc(timerDocRef, {
            created: serverTimestamp()
        })
};

export const removeTimer = async (pageId, timerId) => {
    await deleteDoc(doc(db, 'pages', pageId, 'timers', timerId));
};