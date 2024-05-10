const initialState = {
    user: null,
    triggerLogout: false,
};
  
  const userReducer = (state = initialState, action: { type: string; payload: any; }) => {
    switch (action.type) {
      case 'SET_USER':
        return {
          ...state,
          user: action.payload,
          triggerLogout: false,  // Reset on setting user
        };
      case 'TRIGGER_LOGOUT':
        return {
          ...state,
          triggerLogout: true,  // Set triggerLogout to true to initiate logout in component
        };
      case 'CLEAR_USER':
        return {
            ...initialState, // Reset to initial state
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  