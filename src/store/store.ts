// HindiGeniusApp/src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';

// Define the RootState type
export type RootState = ReturnType<typeof store.getState>;

// Create the Redux store using RTK's configureStore
const store = configureStore({
  reducer: {
    user: userReducer,
    // You can add more reducers here as needed
  },
  // Redux Toolkit includes Redux Thunk middleware by default, so there's no need to explicitly add it
  // If you need to add more middleware, you can do so in the middleware array
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(yourMiddleware),
});

export default store;
