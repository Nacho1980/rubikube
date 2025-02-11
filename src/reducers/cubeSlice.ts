import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CubeState } from "../types";

// Initialize each face as a 3×3 grid filled with the same color.
const initialState: CubeState = {
  faces: {
    U: { stickers: Array(9).fill("white") },
    D: { stickers: Array(9).fill("yellow") },
    F: { stickers: Array(9).fill("green") },
    B: { stickers: Array(9).fill("blue") },
    L: { stickers: Array(9).fill("orange") },
    R: { stickers: Array(9).fill("red") },
  },
};

/**
 * Rotates an array of 9 stickers (a 3x3 grid) by 90°.
 * @param stickers - An array of 9 strings.
 * @param clockwise - If true, rotate 90° clockwise; otherwise, counterclockwise.
 * @returns A new array of stickers after rotation.
 */
const rotateStickers = (stickers: string[], clockwise: boolean): string[] => {
  if (stickers.length !== 9) return stickers;
  const newStickers = new Array<string>(9);
  if (clockwise) {
    // For a 3x3 grid, the mapping for a 90° clockwise rotation is:
    // new[0] = old[6], new[1] = old[3], new[2] = old[0],
    // new[3] = old[7], new[4] = old[4], new[5] = old[1],
    // new[6] = old[8], new[7] = old[5], new[8] = old[2]
    const mapping = [6, 3, 0, 7, 4, 1, 8, 5, 2];
    for (let i = 0; i < 9; i++) {
      newStickers[i] = stickers[mapping[i]];
    }
  } else {
    // The inverse mapping for a 90° counterclockwise rotation is:
    // new[0] = old[2], new[1] = old[5], new[2] = old[8],
    // new[3] = old[1], new[4] = old[4], new[5] = old[7],
    // new[6] = old[0], new[7] = old[3], new[8] = old[6]
    const mapping = [2, 5, 8, 1, 4, 7, 0, 3, 6];
    for (let i = 0; i < 9; i++) {
      newStickers[i] = stickers[mapping[i]];
    }
  }
  return newStickers;
};

const cubeSlice = createSlice({
  name: "cube",
  initialState,
  reducers: {
    // Action payload: an object containing the face identifier (e.g., "U", "F", etc.) and a boolean for rotation direction.
    rotateFace: (
      state,
      action: PayloadAction<{
        face: keyof CubeState["faces"];
        clockwise: boolean;
      }>
    ) => {
      const { face, clockwise } = action.payload;
      // Rotate only the stickers of the specified face.
      state.faces[face].stickers = rotateStickers(
        state.faces[face].stickers,
        clockwise
      );
    },
    resetCube: () => initialState,
  },
});

export const { rotateFace, resetCube } = cubeSlice.actions;
export default cubeSlice.reducer;
