import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BLUE, GREEN, ORANGE, RED, WHITE, YELLOW } from "../constants";
import { CubeState } from "../types";

// Initialize each face as a 3×3 grid filled with the same color.
const initialState: CubeState = {
  faces: {
    U: { stickers: Array(9).fill(WHITE) },
    D: { stickers: Array(9).fill(YELLOW) },
    F: { stickers: Array(9).fill(GREEN) },
    B: { stickers: Array(9).fill(BLUE) },
    L: { stickers: Array(9).fill(ORANGE) },
    R: { stickers: Array(9).fill(RED) },
  },
};

export const cubeSlice = createSlice({
  name: "cube",
  initialState,
  reducers: {
    rotateLayer: (
      state,
      action: PayloadAction<{
        axis: "x" | "y" | "z";
        layer: number;
        direction: 1 | -1;
      }>
    ) => {
      const { axis, layer, direction } = action.payload;

      // Create a deep copy of the current state
      const newState = JSON.parse(JSON.stringify(state.faces));

      switch (axis) {
        case "x": // Rotate around x-axis (R/L faces)
          if (layer === -1) {
            // Left face
            rotateX(newState, 0, direction);
          } else if (layer === 1) {
            // Right face
            rotateX(newState, 2, direction);
          }
          break;

        case "y": // Rotate around y-axis (U/D faces)
          if (layer === -1) {
            // Down face
            rotateY(newState, 0, direction);
          } else if (layer === 1) {
            // Up face
            rotateY(newState, 2, direction);
          }
          break;

        case "z": // Rotate around z-axis (F/B faces)
          if (layer === -1) {
            // Back face
            rotateZ(newState, 0, direction);
          } else if (layer === 1) {
            // Front face
            rotateZ(newState, 2, direction);
          }
          break;
      }

      state.faces = newState;
    },
  },
});

// Helper functions for rotating faces
const rotateX = (
  faces: CubeState["faces"],
  layer: number,
  direction: 1 | -1
) => {
  const temp = [...faces.F.stickers];
  if (direction === 1) {
    // Rotate clockwise around X
    for (let i = 0; i < 3; i++) {
      faces.F.stickers[layer + i * 3] = faces.D.stickers[layer + i * 3];
      faces.D.stickers[layer + i * 3] = faces.B.stickers[layer + i * 3];
      faces.B.stickers[layer + i * 3] = faces.U.stickers[layer + i * 3];
      faces.U.stickers[layer + i * 3] = temp[layer + i * 3];
    }
  } else {
    // Rotate counter-clockwise around X
    for (let i = 0; i < 3; i++) {
      faces.F.stickers[layer + i * 3] = faces.U.stickers[layer + i * 3];
      faces.U.stickers[layer + i * 3] = faces.B.stickers[layer + i * 3];
      faces.B.stickers[layer + i * 3] = faces.D.stickers[layer + i * 3];
      faces.D.stickers[layer + i * 3] = temp[layer + i * 3];
    }
  }
};

const rotateY = (
  faces: CubeState["faces"],
  layer: number,
  direction: 1 | -1
) => {
  const temp = [...faces.F.stickers];
  if (direction === 1) {
    // Rotate clockwise around Y
    for (let i = 0; i < 3; i++) {
      faces.F.stickers[i + layer * 3] = faces.R.stickers[i + layer * 3];
      faces.R.stickers[i + layer * 3] = faces.B.stickers[i + layer * 3];
      faces.B.stickers[i + layer * 3] = faces.L.stickers[i + layer * 3];
      faces.L.stickers[i + layer * 3] = temp[i + layer * 3];
    }
  } else {
    // Rotate counter-clockwise around Y
    for (let i = 0; i < 3; i++) {
      faces.F.stickers[i + layer * 3] = faces.L.stickers[i + layer * 3];
      faces.L.stickers[i + layer * 3] = faces.B.stickers[i + layer * 3];
      faces.B.stickers[i + layer * 3] = faces.R.stickers[i + layer * 3];
      faces.R.stickers[i + layer * 3] = temp[i + layer * 3];
    }
  }
};

const rotateZ = (
  faces: CubeState["faces"],
  layer: number,
  direction: 1 | -1
) => {
  const temp = [...faces.U.stickers];
  if (direction === 1) {
    // Rotate clockwise around Z
    for (let i = 0; i < 3; i++) {
      faces.U.stickers[i + layer * 3] = faces.L.stickers[2 - i + layer * 3];
      faces.L.stickers[2 - i + layer * 3] = faces.D.stickers[i + layer * 3];
      faces.D.stickers[i + layer * 3] = faces.R.stickers[2 - i + layer * 3];
      faces.R.stickers[2 - i + layer * 3] = temp[i + layer * 3];
    }
  } else {
    // Rotate counter-clockwise around Z
    for (let i = 0; i < 3; i++) {
      faces.U.stickers[i + layer * 3] = faces.R.stickers[2 - i + layer * 3];
      faces.R.stickers[2 - i + layer * 3] = faces.D.stickers[i + layer * 3];
      faces.D.stickers[i + layer * 3] = faces.L.stickers[2 - i + layer * 3];
      faces.L.stickers[2 - i + layer * 3] = temp[i + layer * 3];
    }
  }
};

export const { rotateLayer } = cubeSlice.actions;
export default cubeSlice.reducer;
