import { configureStore, combineReducers, ThunkAction, Action } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import userReducer from './reducers/userSlice'; // Import your user reducer

// Persist configuration
const persistConfig = {
  key: 'root', // Key for the persisted state in storage
  storage, // Storage engine (localStorage)
  whitelist: ['user'] // Specify which reducers to persist (only 'user' in this case)
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers here if you have them
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Ignore redux-persist action types for serializability check
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a persistor object
export const persistor = persistStore(store);

// Export types for type annotations
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // Export AppDispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
