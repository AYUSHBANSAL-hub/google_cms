// src/actions.js
import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const getContents = () => async (dispatch) => {
  const snapshot = await getDocs(collection(db, 'your-collection'));
  const subcollectionNames = snapshot.docs.map(doc=>doc.id)
  const hasTest = subcollectionNames.filter(name => name.includes('ALJ'));
  console.log(hasTest)
  const contents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log(contents)
  dispatch({
    type: 'GET_CONTENTS',
    payload: contents,
  });

  // const getSubcollections = async (docRef) => {
  //   const subcollections = {};
  //   const collectionsSnapshot = await listCollections(docRef);
  //   for (const subcollectionRef of collectionsSnapshot) {
  //     const subcollectionName = subcollectionRef.id;
  //     const subcollectionDocsSnapshot = await getDocs(
  //       collection(docRef, subcollectionName)
  //     );
  //     const subcollectionDocs = subcollectionDocsSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     subcollections[subcollectionName] = subcollectionDocs;

  //     for (const subDoc of subcollectionDocsSnapshot.docs) {
  //       const subDocRef = doc(db, subcollectionName, subDoc.id);
  //       subcollections[subcollectionName][subDoc.id] = await getSubcollections(
  //         subDocRef
  //       );
  //     }
  //   }
  //   return subcollections;
  // };
};

export const addContent = (content) => async (dispatch) => {
  const docRef = await addDoc(collection(db, "your-collection"), content);
  dispatch({
    type: "ADD_CONTENT",
    payload: { id: docRef.id, ...content },
  });
};

export const updateContent = (id, content) => async (dispatch) => {
  const docRef = doc(db, "your-collection", id);
  await updateDoc(docRef, content);
  dispatch({
    type: "UPDATE_CONTENT",
    payload: { id, ...content },
  });
};

export const deleteContent = (id) => async (dispatch) => {
  const docRef = doc(db, "your-collection", id);
  await deleteDoc(docRef);
  dispatch({
    type: "DELETE_CONTENT",
    payload: id,
  });
};
