import { configureStore } from "@reduxjs/toolkit";
import rubikubeReducer from "../reducers/cubeSlice";

export const store = configureStore({
  reducer: {
    rubikube: rubikubeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
