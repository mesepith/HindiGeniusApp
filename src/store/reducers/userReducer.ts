const initialState = {
    user: null,
  };
  
  const userReducer = (state = initialState, action: { type: string; payload: any; }) => {
    switch (action.type) {
      case 'SET_USER':
        return {
          ...state,
          user: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  