// src/reducers/cubeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CubeState } from "../types";

const initialState: CubeState = {
  U: Array(9).fill("white"),
  D: Array(9).fill("yellow"),
  F: Array(9).fill("green"),
  B: Array(9).fill("blue"),
  L: Array(9).fill("orange"),
  R: Array(9).fill("red"),
};

const cubeSlice = createSlice({
  name: "cube",
  initialState,
  reducers: {
    rotateFace: (
      state,
      action: PayloadAction<{ face: keyof CubeState; clockwise: boolean }>
    ) => {
      const { face, clockwise } = action.payload;
      const newFace = [...state[face]];
      const indices = [0, 1, 2, 5, 8, 7, 6, 3];
      const rotated = indices.map(
        (_, i) => newFace[indices[(i + (clockwise ? 6 : 2)) % 8]]
      );
      indices.forEach((index, i) => (newFace[index] = rotated[i]));
      state[face] = newFace;
    },
    resetCube: () => initialState,
  },
});

export const { rotateFace, resetCube } = cubeSlice.actions;
export default cubeSlice.reducer;
