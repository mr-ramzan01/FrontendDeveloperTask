import { configureStore, combineReducers, ThunkAction, Action } from '@reduxjs/toolkit';
// Root reducer combining all reducers
const rootReducer = combineReducers({
  // add the redux values here
});

// Create the Redux store
export const store = configureStore({
  reducer: rootReducer,
});

// Export types for type annotations
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
