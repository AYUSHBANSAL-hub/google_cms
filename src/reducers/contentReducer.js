const initialState = {
    contents: [],
    loading: true,
  };

  const contentReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'GET_CONTENTS':
        return {
          ...state,
          contents: action.payload,
          loading: false,
        };
        case 'SET_NULL':
          return{
            contents:[],
            loading:false
          }
      case 'ADD_CONTENT':
        return {
          ...state,
          contents: [...state.contents, action.payload],
        };
      case 'UPDATE_CONTENT':
        return {
          ...state,
          contents: state.contents.map(content =>
            content.id === action.payload.id ? action.payload : content
          ),
        };
      case 'DELETE_CONTENT':
        return {
          ...state,
          contents: state.contents.filter(content => content.id !== action.payload),
        };
      default:
        return state;
    }
  };

  export default contentReducer;