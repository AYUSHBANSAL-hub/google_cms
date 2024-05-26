
import axios from 'axios';
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
const hardcodedDocumentNames = [
  'test-contests',
'test-home-page-carousel',
'test-knowledge-centre-articles',
'test-knowledge-centre-carousels',
'test-knowledge-centre-posts',
'test-store-hub-page',
'test-collection'
];
export const getContents = () => async (dispatch) => {
  try {
    // Hardcoded document names
    const hardcodedDocumentNames = [
      'test-contests',
      'test-home-page-carousel',
      'test-knowledge-centre-articles',
      'test-knowledge-centre-carousels',
      'test-knowledge-centre-posts',
      'test-store-hub-page',
      'test-collection'
    ];

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
      console.log('hello');
      const apiUrl = `https://cms-data.testexperience.site/fetch/${documentName}`;
     console.log(documentName);
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
      console.log(ParentDocName);
      const response = await axios.get(apiUrl);
      const keysWithCA = Object.keys(response.data)
      .filter(key => key.includes(`${documentName}`))
      .map(key => ({ id: key }));
    
    console.log(keysWithCA);
    
    if (keysWithCA.length === 1) {
      ParentDocName = ParentDocName + "/"  +keysWithCA[0].id; // Access the id from the first item
    }
    
    console.log(ParentDocName);
    
      
      if (documentName == keysWithCA[0]?.id && keysWithCA.length == 1) {
        const contestData = response.data[keysWithCA[0].id];
        console.log(contestData);
        return contestData; 
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
  const docRef = await addDoc(collection(db, ParentDocName), content);
  dispatch({
    type: "ADD_CONTENT",
    payload: { id: docRef.id, ...content },
  });
};

export const updateContent = (content) => async (dispatch) => {
  console.log(content);
  try {
    await updateDoc(doc(db, ParentDocName), content);
    console.log(ParentDocName);
    
    dispatch({
      type: "UPDATE_CONTENT",
      payload: content, 
    });
  } catch (error) {
    console.error("Error updating content:", error);
    dispatch({
      type: "UPDATE_CONTENT_ERROR",
      payload: error.message,
    });
  }
};

export const deleteContent = (id) => async (dispatch) => {
  const docRef = doc(db, ParentDocName, id);
  await deleteDoc(docRef);
  dispatch({
    type: "DELETE_CONTENT",
    payload: id,
  });
};
