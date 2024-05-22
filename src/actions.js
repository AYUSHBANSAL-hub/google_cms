import { db } from './firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';

export const getContents = () => async (dispatch) => {
  const snapshot = await getDocs(collection(db, 'your-collection'));
  const subcollectionNames = snapshot.docs.map(doc => doc.id);
  const hasTest = subcollectionNames.filter(name => name.startsWith('test_'));
  console.log(hasTest);
  const contents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log(contents);
  dispatch({
    type: 'GET_CONTENTS',
    payload: contents,
  });
};

export const setContentsNULL = () => async (dispatch) => {
  dispatch({
    type: 'SET_NULL',
    payload: null,
  });
};

export const getContentsWithLink = (pathArray) => async (dispatch) => {
  try {
    console.log(pathArray); // Log the path array to ensure it's correct

    if (!pathArray || pathArray.length < 1) {
      console.warn('Invalid path array: must contain at least one element');
      return;
    }

    let ref = collection(db, pathArray[0]); // Initialize Firestore collection reference

    for (let i = 1; i < pathArray.length; i++) {
      if (i % 2 === 1) { // If the index is odd, it should be a document ID
        ref = doc(ref, pathArray[i]);
      } else { // If the index is even, it should be a subcollection name
        ref = collection(ref, pathArray[i]);
      }
    }

    // Check if the final ref is a document or a collection
    let contents;
    if (ref.type === 'document') {
      const docSnapshot = await getDoc(ref);
      if (!docSnapshot.exists()) {
        console.warn(`No document found at path: ${pathArray.join('/')}`);
        return;
      }
      contents = [{ id: docSnapshot.id, ...docSnapshot.data() }];
    } else {
      const snapshot = await getDocs(ref);
      if (snapshot.empty) {
        console.warn(`No documents found at path: ${pathArray.join('/')}`);
        return;
      }
      contents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    dispatch({
      type: 'GET_CONTENTS',
      payload: contents,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    dispatch({
      type: 'GET_CONTENTS',
      payload: null, // Dispatch null on error
    });
  }
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
