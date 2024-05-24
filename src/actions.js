
import axios from 'axios';
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
const hardcodedDocumentNames = [
  'contests',
  'home-page-carousel',
  'knowledge-centre-articles',
  'knowledge-centre-carousels',
  'knowledge-centre-posts',
  'store-hub-page',
  'store-hub-page-carousel1',
  'store-hub-page-carousel2',
  'store-hub-page-carousel3',
  'store-hub-page-carousel4',
];
export const getContents = () => async (dispatch) => {
  try {
    // Hardcoded document names
    const hardcodedDocumentNames = [
      'contests',
      'home-page-carousel',
      'knowledge-centre-articles',
      'knowledge-centre-carousels',
      'knowledge-centre-posts',
      'store-hub-page',
      'store-hub-page-carousel1',
      'store-hub-page-carousel2',
      'store-hub-page-carousel3',
      'store-hub-page-carousel4',
    ];

    // Create an array of objects with the hardcoded document names
    const contents = hardcodedDocumentNames.map(name => ({ id: name }));

    console.log('Initial hardcoded document names:', contents);

    dispatch({
      type: 'GET_CONTENTS',
      payload: contents,
    });
  } catch (error) {
    console.error('Error fetching contents:', error);
    dispatch({
      type: 'GET_CONTENTS_ERROR',
      payload: error.message,
    });
  }
};
let ParentDocName = "";

export const getContentsWithLink = (documentName) => async (dispatch) => {
  try {
    if (hardcodedDocumentNames.includes(documentName)) {
      const apiUrl = `https://cms-data.testexperience.site/fetch/${documentName}`;
      ParentDocName = documentName;

      const response = await axios.get(apiUrl);
      const emptyObjectKeys = Object.entries(response.data)
        .filter(([key, value]) => typeof value === 'object' && Object.keys(value).length === 0)
        .map(([key, value]) => key);
      
      const emptyObjects = emptyObjectKeys.map(key => ({ id: key }));
      console.log(emptyObjects);
      const withObjectKeys = Object.entries(response.data)
        .filter(([key, value]) => typeof value === 'object' && Object.keys(value).length !== 0)
        .map(([key, value]) => key);
      const withObject = withObjectKeys.map(key => ({ id: key }));

      if (emptyObjectKeys.length != 0) {
        dispatch({
          type: 'GET_CONTENTS',
          payload: emptyObjects,
        });
      } else {
        dispatch({
          type: 'GET_CONTENTS',
          payload: withObject,
        });
      }
    } else {
      const apiUrl = `https://cms-data.testexperience.site/fetch/${ParentDocName}`;
      const response = await axios.get(apiUrl);
      const keysWithCA = Object.keys(response.data)
        .filter(key => key.includes(`${documentName}`))
        .map(key => ({ id: key }));
      
      console.log(keysWithCA);
      
      if (documentName == keysWithCA[0]?.id && keysWithCA.length == 1) {
        const contestData = response.data[keysWithCA[0].id];
        console.log(contestData);
        return contestData; // Return contest data here
      } else {
        const filteredKeys = keysWithCA.slice(1);
        dispatch({
          type: 'GET_CONTENTS',
          payload: keysWithCA,
        });
      }
      
    }
  } catch (error) {
    console.error('Error fetching content from API:', error);
    dispatch({
      type: 'GET_CONTENTS_ERROR',
      payload: error.message,
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
