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

// 3x3 face rotation helper
function rotateMatrix(stickers: string[], direction: 1 | -1): string[] {
  const newS = [...stickers];
  if (direction === 1) {
    // clockwise
    newS[0] = stickers[6];
    newS[1] = stickers[3];
    newS[2] = stickers[0];
    newS[3] = stickers[7];
    newS[4] = stickers[4];
    newS[5] = stickers[1];
    newS[6] = stickers[8];
    newS[7] = stickers[5];
    newS[8] = stickers[2];
  } else {
    // counter-clockwise
    newS[0] = stickers[2];
    newS[1] = stickers[5];
    newS[2] = stickers[8];
    newS[3] = stickers[1];
    newS[4] = stickers[4];
    newS[5] = stickers[7];
    newS[6] = stickers[0];
    newS[7] = stickers[3];
    newS[8] = stickers[6];
  }
  return newS;
}

/**
 * Same 3D->face indexing as in Cubie.tsx:
 * U => x + 3*(2 - z)
 * D => x + 3*z
 * F => x + 3*(2 - y)
 * B => (2 - x) + 3*(2 - y)
 * L => z + 3*(2 - y)
 * R => (2 - z) + 3*(2 - y)
 */
function getIndex(face: keyof Faces, x: number, y: number, z: number): number {
  switch (face) {
    case "U":
      return x + 3 * (2 - z);
    case "D":
      return x + 3 * z;
    case "F":
      return x + 3 * (2 - y);
    case "B":
      return 2 - x + 3 * (2 - y);
    case "L":
      return z + 3 * (2 - y);
    case "R":
      return 2 - z + 3 * (2 - y);
  }
  return 0;
}

export const cubeSlice = createSlice({
  name: "cube",
  initialState,
  reducers: {
    rotateLayer: (
      state,
      action: PayloadAction<{
        axis: "x" | "y" | "z";
        layer: number; // 0..2
        direction: 1 | -1;
      }>
    ) => {
      const { axis, layer, direction } = action.payload;
      const newFaces = JSON.parse(JSON.stringify(state.faces)) as Faces;

      if (axis === "x") {
        rotateX(newFaces, layer, direction);
      } else if (axis === "y") {
        rotateY(newFaces, layer, direction);
      } else {
        rotateZ(newFaces, layer, direction);
      }

      state.faces = newFaces;
    },
  },
});

/** Rotate the slice x=layer. For layer=0..2. */
function rotateX(faces: Faces, layer: number, direction: 1 | -1) {
  // We'll cycle the 9 cubies in that vertical slice among U,F,D,B.
  // Then if layer=0 or 2, also rotate L or R face.

  // Copy old arrays so we can read them without overwriting mid-cycle
  const Uold = [...faces.U.stickers];
  const Fold = [...faces.F.stickers];
  const Dold = [...faces.D.stickers];
  const Bold = [...faces.B.stickers];

  // For x=layer, we vary y=0..2, z=0..2
  for (let y = 0; y < 3; y++) {
    for (let z = 0; z < 3; z++) {
      const uIdx = getIndex("U", layer, y, z);
      const fIdx = getIndex("F", layer, y, z);
      const dIdx = getIndex("D", layer, y, z);
      const bIdx = getIndex("B", layer, y, z);

      if (direction === 1) {
        // R or L move, but "clockwise" if we look from outside the x=layer face
        // U->F->D->B->U
        faces.F.stickers[fIdx] = Uold[uIdx];
        faces.D.stickers[dIdx] = Fold[fIdx];
        faces.B.stickers[bIdx] = Dold[dIdx];
        faces.U.stickers[uIdx] = Bold[bIdx];
      } else {
        // Reverse cycle: U->B->D->F->U
        faces.U.stickers[uIdx] = Fold[fIdx];
        faces.F.stickers[fIdx] = Dold[dIdx];
        faces.D.stickers[dIdx] = Bold[bIdx];
        faces.B.stickers[bIdx] = Uold[uIdx];
      }
    }
  }

  // Also rotate the face if it's x=0 or x=2
  if (layer === 0) {
    // Left face
    faces.L.stickers = rotateMatrix(faces.L.stickers, -direction as 1 | -1);
  } else if (layer === 2) {
    // Right face
    faces.R.stickers = rotateMatrix(faces.R.stickers, direction);
  }
}

/** Rotate the slice y=layer. For layer=0..2. */
function rotateY(faces: Faces, layer: number, direction: 1 | -1) {
  // We'll cycle among F,R,B,L for that row. Then rotate U or D if y=2 or 0.
  const Fold = [...faces.F.stickers];
  const Rold = [...faces.R.stickers];
  const Bold = [...faces.B.stickers];
  const Lold = [...faces.L.stickers];

  // For y=layer, vary x=0..2, z=0..2
  for (let x = 0; x < 3; x++) {
    for (let z = 0; z < 3; z++) {
      const fIdx = getIndex("F", x, layer, z);
      const rIdx = getIndex("R", x, layer, z);
      const bIdx = getIndex("B", x, layer, z);
      const lIdx = getIndex("L", x, layer, z);

      if (direction === 1) {
        // "U" or "D" style cycle: F->R->B->L->F
        faces.R.stickers[rIdx] = Fold[fIdx];
        faces.B.stickers[bIdx] = Rold[rIdx];
        faces.L.stickers[lIdx] = Bold[bIdx];
        faces.F.stickers[fIdx] = Lold[lIdx];
      } else {
        // Reverse cycle: F->L->B->R->F
        faces.F.stickers[fIdx] = Rold[rIdx];
        faces.R.stickers[rIdx] = Bold[bIdx];
        faces.B.stickers[bIdx] = Lold[lIdx];
        faces.L.stickers[lIdx] = Fold[fIdx];
      }
    }
  }

  // Rotate top/bottom if layer=2 or 0
  if (layer === 2) {
    // U face
    faces.U.stickers = rotateMatrix(faces.U.stickers, direction);
  } else if (layer === 0) {
    // D face
    faces.D.stickers = rotateMatrix(faces.D.stickers, -direction as 1 | -1);
  }
}

/** Rotate the slice z=layer. For layer=0..2. */
function rotateZ(faces: Faces, layer: number, direction: 1 | -1) {
  // We'll cycle among U,L,D,R. Then rotate F or B if z=2 or 0.
  const Uold = [...faces.U.stickers];
  const Lold = [...faces.L.stickers];
  const Dold = [...faces.D.stickers];
  const Rold = [...faces.R.stickers];

  // For z=layer, vary x=0..2, y=0..2
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const uIdx = getIndex("U", x, y, layer);
      const lIdx = getIndex("L", x, y, layer);
      const dIdx = getIndex("D", x, y, layer);
      const rIdx = getIndex("R", x, y, layer);

      if (direction === 1) {
        // "F" style: U->L->D->R->U
        faces.L.stickers[lIdx] = Uold[uIdx];
        faces.D.stickers[dIdx] = Lold[lIdx];
        faces.R.stickers[rIdx] = Dold[dIdx];
        faces.U.stickers[uIdx] = Rold[rIdx];
      } else {
        // "F'" style: U->R->D->L->U
        faces.U.stickers[uIdx] = Lold[lIdx];
        faces.L.stickers[lIdx] = Dold[dIdx];
        faces.D.stickers[dIdx] = Rold[rIdx];
        faces.R.stickers[rIdx] = Uold[uIdx];
      }
    }
  }

  // Rotate front/back if layer=2 or 0
  if (layer === 2) {
    faces.F.stickers = rotateMatrix(faces.F.stickers, direction);
  } else if (layer === 0) {
    faces.B.stickers = rotateMatrix(faces.B.stickers, -direction as 1 | -1);
  }
}

export const { rotateLayer } = cubeSlice.actions;
export default cubeSlice.reducer;
