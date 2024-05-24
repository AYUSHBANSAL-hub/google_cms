const initialState = {
  contents: [],
  loading: true,
  error: null,
};

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CONTENTS':
      return {
        ...state,
        contents: action.payload,
        loading: false,
        error: null,
      };
      
    case 'GET_CONTENTS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'ADD_CONTENT':
      return {
        ...state,
        contents: [...state.contents, action.payload],
        error: null,
      };
      case 'UPDATE_CONTENT':
        return {
          ...state,
          contents: action.payload, // Replace contents array with updated content
          error: null,
        };
      
    case 'DELETE_CONTENT':
      return {
        ...state,
        contents: state.contents.filter(content => content.id !== action.payload),
        error: null,
      };
    default:
      return state;
  }
};

export default contentReducer;
