// src/actions.js
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const getContents = () => async dispatch => {
  const snapshot = await getDocs(collection(db, 'your-collection'));
  const contents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  dispatch({
    type: 'GET_CONTENTS',
    payload: contents,
  });
};

export const addContent = content => async dispatch => {
  const docRef = await addDoc(collection(db, 'your-collection'), content);
  dispatch({
    type: 'ADD_CONTENT',
    payload: { id: docRef.id, ...content },
  });
};

export const updateContent = (id, content) => async dispatch => {
  const docRef = doc(db, 'your-collection', id);
  await updateDoc(docRef, content);
  dispatch({
    type: 'UPDATE_CONTENT',
    payload: { id, ...content },
  });
};

export const deleteContent = id => async dispatch => {
  const docRef = doc(db, 'your-collection', id);
  await deleteDoc(docRef);
  dispatch({
    type: 'DELETE_CONTENT',
    payload: id,
  });
};
