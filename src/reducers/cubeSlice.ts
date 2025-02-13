// cubeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BLUE, GREEN, ORANGE, RED, WHITE, YELLOW } from "../constants";

interface FaceData {
  stickers: string[];
}
interface Faces {
  U: FaceData;
  D: FaceData;
  F: FaceData;
  B: FaceData;
  L: FaceData;
  R: FaceData;
}

export interface CubeState {
  faces: Faces;
}

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
        layer: number; // 0,1,2
        direction: 1 | -1;
      }>
    ) => {
      const { axis, layer, direction } = action.payload;
      const newFaces = JSON.parse(JSON.stringify(state.faces));

      switch (axis) {
        case "x": {
          if (layer === 0) rotateX(newFaces, 0, direction);
          else if (layer === 2) rotateX(newFaces, 2, direction);
          break;
        }
        case "y": {
          if (layer === 0) rotateY(newFaces, 0, direction);
          else if (layer === 2) rotateY(newFaces, 2, direction);
          break;
        }
        case "z": {
          if (layer === 0) rotateZ(newFaces, 0, direction);
          else if (layer === 2) rotateZ(newFaces, 2, direction);
          break;
        }
      }
      state.faces = newFaces;
    },
  },
});

function rotateX(faces: Faces, layer: number, direction: 1 | -1) {
  const temp = [...faces.F.stickers];
  if (direction === 1) {
    for (let i = 0; i < 3; i++) {
      faces.F.stickers[layer + i * 3] = faces.D.stickers[layer + i * 3];
      faces.D.stickers[layer + i * 3] = faces.B.stickers[layer + i * 3];
      faces.B.stickers[layer + i * 3] = faces.U.stickers[layer + i * 3];
      faces.U.stickers[layer + i * 3] = temp[layer + i * 3];
    }
  } else {
    for (let i = 0; i < 3; i++) {
      faces.F.stickers[layer + i * 3] = faces.U.stickers[layer + i * 3];
      faces.U.stickers[layer + i * 3] = faces.B.stickers[layer + i * 3];
      faces.B.stickers[layer + i * 3] = faces.D.stickers[layer + i * 3];
      faces.D.stickers[layer + i * 3] = temp[layer + i * 3];
    }
  }
}

function rotateY(faces: Faces, layer: number, direction: 1 | -1) {
  const temp = [...faces.F.stickers];
  if (direction === 1) {
    for (let i = 0; i < 3; i++) {
      faces.F.stickers[i + layer * 3] = faces.R.stickers[i + layer * 3];
      faces.R.stickers[i + layer * 3] = faces.B.stickers[i + layer * 3];
      faces.B.stickers[i + layer * 3] = faces.L.stickers[i + layer * 3];
      faces.L.stickers[i + layer * 3] = temp[i + layer * 3];
    }
  } else {
    for (let i = 0; i < 3; i++) {
      faces.F.stickers[i + layer * 3] = faces.L.stickers[i + layer * 3];
      faces.L.stickers[i + layer * 3] = faces.B.stickers[i + layer * 3];
      faces.B.stickers[i + layer * 3] = faces.R.stickers[i + layer * 3];
      faces.R.stickers[i + layer * 3] = temp[i + layer * 3];
    }
  }
}

function rotateZ(faces: Faces, layer: number, direction: 1 | -1) {
  const temp = [...faces.U.stickers];
  if (direction === 1) {
    for (let i = 0; i < 3; i++) {
      faces.U.stickers[i + layer * 3] = faces.L.stickers[2 - i + layer * 3];
      faces.L.stickers[2 - i + layer * 3] = faces.D.stickers[i + layer * 3];
      faces.D.stickers[i + layer * 3] = faces.R.stickers[2 - i + layer * 3];
      faces.R.stickers[2 - i + layer * 3] = temp[i + layer * 3];
    }
  } else {
    for (let i = 0; i < 3; i++) {
      faces.U.stickers[i + layer * 3] = faces.R.stickers[2 - i + layer * 3];
      faces.R.stickers[2 - i + layer * 3] = faces.D.stickers[i + layer * 3];
      faces.D.stickers[i + layer * 3] = faces.L.stickers[2 - i + layer * 3];
      faces.L.stickers[2 - i + layer * 3] = temp[i + layer * 3];
    }
  }
}

export const { rotateLayer } = cubeSlice.actions;
export default cubeSlice.reducer;
