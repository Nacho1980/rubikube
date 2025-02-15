// cubeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BLUE, GREEN, ORANGE, RED, WHITE, YELLOW } from "../constants";
import { Faces } from "../types";
import {
  coordsToLinear,
  getRotationIndex,
  linearToCoords,
} from "../utils/utils";

export interface CubeState {
  faces: Faces; // Each face is a 9-element array of color strings
}

// Initial faces: 3×3 of each color
const initialState: CubeState = {
  faces: {
    U: Array(9).fill(WHITE),
    D: Array(9).fill(YELLOW),
    F: Array(9).fill(GREEN),
    B: Array(9).fill(BLUE),
    L: Array(9).fill(ORANGE),
    R: Array(9).fill(RED),
  },
};

/**
 * Rotates a 3×3 array of stickers 90° in the given direction:
 *   direction =  1 => clockwise
 *   direction = -1 => counterclockwise
 */
const rotateMatrix = (stickers: string[], direction: 1 | -1): string[] => {
  const result = new Array(9);
  for (let i = 0; i < 9; i++) {
    const [row, col] = linearToCoords(i);
    if (direction === 1) {
      // Clockwise: (row,col) → (col, 2 - row)
      result[coordsToLinear(col, 2 - row)] = stickers[i];
    } else {
      // Counterclockwise: (row,col) → (2 - col, row)
      result[coordsToLinear(2 - col, row)] = stickers[i];
    }
  }
  return result;
};

/* ------------------------------------------------------------------
   X-AXIS ROTATION (layer = 0..2)

   If layer=2, it's the "Right" face. If layer=0, it's the "Left" face.
   The ring of stickers to swap is among U,F,D,B for x=layer.

   For a physically correct "right-face clockwise" turn (layer=2, direction=1),
   we want: Up→Front→Down→Back→Up.  The code below does that ring for each row/col.
------------------------------------------------------------------ */
const rotateX = (faces: Faces, layer: number, direction: 1 | -1) => {
  // Make temp copies
  const tempU = [...faces.U];
  const tempF = [...faces.F];
  const tempD = [...faces.D];
  const tempB = [...faces.B];

  // We swap all squares where x=layer, i.e. (layer, y, z).
  // We'll iterate y=0..2, z=0..2 in a ring-like pattern.
  for (let y = 0; y < 3; y++) {
    for (let z = 0; z < 3; z++) {
      const uIndex = getRotationIndex(layer, y, z, "U");
      const fIndex = getRotationIndex(layer, y, z, "F");
      const dIndex = getRotationIndex(layer, y, z, "D");
      const bIndex = getRotationIndex(layer, y, z, "B");

      if (direction === 1) {
        // Right-face "clockwise" from the outside means: U→F, F→D, D→B, B→U
        faces.F[fIndex] = tempU[uIndex];
        faces.D[dIndex] = tempF[fIndex];
        faces.B[bIndex] = tempD[dIndex];
        faces.U[uIndex] = tempB[bIndex];
      } else {
        // Opposite direction
        faces.U[uIndex] = tempF[fIndex];
        faces.F[fIndex] = tempD[dIndex];
        faces.D[dIndex] = tempB[bIndex];
        faces.B[bIndex] = tempU[uIndex];
      }
    }
  }

  // If it's the left or right outer slice, rotate that face's 3×3 array
  if (layer === 0) {
    // Left face => rotate L by -direction (mirrors the perspective)
    faces.L = rotateMatrix(faces.L, -direction as 1 | -1);
  } else if (layer === 2) {
    // Right face => rotate R by +direction
    faces.R = rotateMatrix(faces.R, direction);
  }
};

/* ------------------------------------------------------------------
   Y-AXIS ROTATION (layer = 0..2)

   If layer=2, it's the "Up" face. If layer=0, it's the "Down" face.
   The ring of stickers is among F,R,B,L for y=layer.

   For a physically correct "up-face clockwise" turn (layer=2, direction=1),
   we want: Front→Right→Back→Left→Front (looking down on the cube).
------------------------------------------------------------------ */
const rotateY = (faces: Faces, layer: number, direction: 1 | -1) => {
  const tempF = [...faces.F];
  const tempR = [...faces.R];
  const tempB = [...faces.B];
  const tempL = [...faces.L];
  //console.log("F before rotate Y:", faces.F);
  //console.log("R before rotate Y:", faces.R);

  // For y=layer, we iterate x=0..2, z=0..2
  for (let x = 0; x < 3; x++) {
    for (let z = 0; z < 3; z++) {
      const fIndex = getRotationIndex(x, layer, z, "F");
      const rIndex = getRotationIndex(x, layer, z, "R");
      const bIndex = getRotationIndex(x, layer, z, "B");
      const lIndex = getRotationIndex(x, layer, z, "L");

      if (direction === 1) {
        // Up-face "clockwise" from top means: F→R, R→B, B→L, L→F
        faces.R[rIndex] = tempF[fIndex];
        faces.B[bIndex] = tempR[rIndex];
        faces.L[lIndex] = tempB[bIndex];
        faces.F[fIndex] = tempL[lIndex];
      } else {
        // Reverse ring
        faces.F[fIndex] = tempR[rIndex];
        faces.R[rIndex] = tempB[bIndex];
        faces.B[bIndex] = tempL[lIndex];
        faces.L[lIndex] = tempF[fIndex];
      }
    }
  }

  // Rotate the Up or Down face if it's an outer slice
  if (layer === 2) {
    // Up face => rotate U by +direction
    faces.U = rotateMatrix(faces.U, direction);
  } else if (layer === 0) {
    // Down face => rotate D by -direction
    faces.D = rotateMatrix(faces.D, -direction as 1 | -1);
  }
  console.log("After rotateY F:", faces.F);
  console.log("After R:", faces.R);
};

/* ------------------------------------------------------------------
   Z-AXIS ROTATION (layer = 0..2)

   If layer=2, it's the "Front" face. If layer=0, it's the "Back" face.
   The ring of stickers is among U,R,D,L for z=layer.

   For a physically correct "front-face clockwise" turn (layer=2, direction=1),
   we want: Up→Right→Down→Left→Up, specifically the row/column that touches z=2.
------------------------------------------------------------------ */
const rotateZ = (faces: Faces, layer: number, direction: 1 | -1) => {
  // Make full copies of affected faces
  const tempU = [...faces.U];
  const tempR = [...faces.R];
  const tempD = [...faces.D];
  const tempL = [...faces.L];

  // We'll iterate over each position in the ring
  for (let i = 0; i < 3; i++) {
    // Get indices for the current position in each face
    const uIndex = getRotationIndex(i, 2, layer, "U"); // Top edge
    const rIndex = getRotationIndex(2, 2 - i, layer, "R"); // Right edge
    const dIndex = getRotationIndex(2 - i, 0, layer, "D"); // Bottom edge
    const lIndex = getRotationIndex(0, i, layer, "L"); // Left edge

    if (direction === 1) {
      // Clockwise: U → R → D → L → U
      faces.R[rIndex] = tempU[uIndex];
      faces.D[dIndex] = tempR[rIndex];
      faces.L[lIndex] = tempD[dIndex];
      faces.U[uIndex] = tempL[lIndex];
    } else {
      // Counterclockwise: U → L → D → R → U
      faces.L[lIndex] = tempU[uIndex];
      faces.D[dIndex] = tempL[lIndex];
      faces.R[rIndex] = tempD[dIndex];
      faces.U[uIndex] = tempR[rIndex];
    }
  }

  // Rotate the front or back face if it's an outer slice
  if (layer === 2) {
    faces.F = rotateMatrix(faces.F, direction);
  } else if (layer === 0) {
    faces.B = rotateMatrix(faces.B, -direction as 1 | -1);
  }
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
      // Clone so we don't mutate state directly
      const newFaces: Faces = {
        U: [...state.faces.U],
        D: [...state.faces.D],
        F: [...state.faces.F],
        B: [...state.faces.B],
        L: [...state.faces.L],
        R: [...state.faces.R],
      };

      ////console.log("Before rotation:", JSON.stringify(newFaces, null, 2));
      if (axis === "x") {
        rotateX(newFaces, layer, direction);
        //  //console.log("After X rotation:", JSON.stringify(newFaces, null, 2));
      } else if (axis === "y") {
        rotateY(newFaces, layer, direction);
        //  //console.log("After Y rotation:", JSON.stringify(newFaces, null, 2));
      } else {
        rotateZ(newFaces, layer, -direction as 1 | -1);
        //  //console.log("After Z rotation:", JSON.stringify(newFaces, null, 2));
      }

      state.faces = newFaces;
    },
  },
});

export const { rotateLayer } = cubeSlice.actions;
export default cubeSlice.reducer;
