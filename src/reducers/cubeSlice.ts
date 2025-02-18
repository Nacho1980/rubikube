// cubeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BLUE,
  GREEN,
  ORANGE,
  RED,
  SHUFFLE_MOVES,
  WHITE,
  YELLOW,
} from "../constants";
import { Faces, Move } from "../types";
import solveCube, { rotationArrayToString } from "../utils/RubikCubeSolver";
import {
  coordsToLinear,
  getRotationIndex,
  linearToCoords,
} from "../utils/utils";

export interface CubeState {
  faces: Faces; // Each face is a 9-element array of color strings
  moves: Move[];
  pendingMoves: Move[]; // For animating moves
}

// Initial faces: 3×3 of each color
const initialState: CubeState = {
  faces: {
    U: Array(9).fill(WHITE), //up
    D: Array(9).fill(YELLOW), //down
    F: Array(9).fill(GREEN), //front
    B: Array(9).fill(BLUE), //back
    L: Array(9).fill(ORANGE), //left
    R: Array(9).fill(RED), //right
  },
  moves: [],
  pendingMoves: [],
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
  const tempU = [...faces.U];
  const tempF = [...faces.F];
  const tempD = [...faces.D];
  const tempB = [...faces.B];

  for (let y = 0; y < 3; y++) {
    // The column for the Front face that has x=layer is simply:
    //    frontIndex = row: y, column: layer  =>  3*y + layer
    // But be careful with "Front" vs "Back" orientation (reversal).
    const uIndex = 3 * y + layer; // column 'layer' on Up
    const fIndex = 3 * y + layer; // column 'layer' on Front
    const dIndex = 3 * y + layer; // column 'layer' on Down
    const bIndex = 3 * (2 - y) + (2 - layer);
    // For the Back face, we want x=layer but reversed horizontally:
    //   left column if layer=0, right column if layer=2, etc.
    // So if x=layer, that column is (2 - layer) on the Back face.
    // Also note we do (2 - y) for the row to keep consistent orientation.

    if (direction === 1) {
      // Counterclockwise: U -> F -> D -> B -> U
      // R'
      faces.F[fIndex] = tempU[uIndex];
      faces.D[dIndex] = tempF[fIndex];
      faces.B[bIndex] = tempD[dIndex];
      faces.U[uIndex] = tempB[bIndex];
    } else {
      // clockwise: U -> B -> D -> F -> U
      // R
      faces.B[bIndex] = tempU[uIndex];
      faces.D[dIndex] = tempB[bIndex];
      faces.F[fIndex] = tempD[dIndex];
      faces.U[uIndex] = tempF[fIndex];
    }
  }

  // Now rotate the face itself if it's an outer layer
  if (layer === 2) {
    // Right face
    faces.R = rotateMatrix(faces.R, direction);
  } else if (layer === 0) {
    // Left face
    faces.L = rotateMatrix(faces.L, -direction as 1 | -1);
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

  if (layer === 2) {
    // Indices for the top row of each face
    const topIndices = [0, 1, 2];
    const reverseIndices = [2, 1, 0];

    if (direction === 1) {
      // Counterclockwise when looking DOWN at the top face
      for (let i = 0; i < 3; i++) {
        faces.R[topIndices[i]] = tempF[reverseIndices[i]];
        faces.B[topIndices[i]] = tempR[reverseIndices[i]];
        faces.L[topIndices[i]] = tempB[reverseIndices[i]];
        faces.F[topIndices[i]] = tempL[reverseIndices[i]];
      }
    } else {
      // clockwise
      for (let i = 0; i < 3; i++) {
        faces.F[topIndices[i]] = tempR[reverseIndices[i]];
        faces.R[topIndices[i]] = tempB[reverseIndices[i]];
        faces.B[topIndices[i]] = tempL[reverseIndices[i]];
        faces.L[topIndices[i]] = tempF[reverseIndices[i]];
      }
    }
  } else if (layer === 0) {
    // Get the indices for the bottom row of each face
    const bottomIndices = [6, 7, 8]; // indices for bottom row
    const reverseIndices = [8, 7, 6]; // reversed order for proper alignment

    if (direction === 1) {
      // Clockwise rotation when looking from the bottom
      for (let i = 0; i < 3; i++) {
        faces.R[bottomIndices[i]] = tempF[reverseIndices[i]];
        faces.B[bottomIndices[i]] = tempR[reverseIndices[i]];
        faces.L[bottomIndices[i]] = tempB[reverseIndices[i]];
        faces.F[bottomIndices[i]] = tempL[reverseIndices[i]];
      }
    } else {
      // Counter-clockwise rotation when looking from the bottom
      for (let i = 0; i < 3; i++) {
        faces.F[bottomIndices[i]] = tempR[reverseIndices[i]];
        faces.R[bottomIndices[i]] = tempB[reverseIndices[i]];
        faces.B[bottomIndices[i]] = tempL[reverseIndices[i]];
        faces.L[bottomIndices[i]] = tempF[reverseIndices[i]];
      }
    }
  } else {
    // Original rotation logic for other layers
    for (let t = 0; t < 3; t++) {
      // Front face: row 1, col = 2 - t
      const fIndex = coordsToLinear(1, 2 - t);
      // Right face: row 1, col = t
      const rIndex = coordsToLinear(1, t);
      // Back face: For the back face mapping (B: coordsToLinear(2 - y, 2 - x)),
      // we want x to correspond to t so that B’s col = 2 - t.
      const bIndex = coordsToLinear(1, 2 - t);
      // Left face: For L (mapping: coordsToLinear(2 - y, 2 - z)),
      // we want z to correspond to 2 - t so that L’s col = 2 - (2 - t) = t.
      const lIndex = coordsToLinear(1, t);

      if (direction === 1) {
        faces.R[rIndex] = tempF[fIndex];
        faces.B[bIndex] = tempR[rIndex];
        faces.L[lIndex] = tempB[bIndex];
        faces.F[fIndex] = tempL[lIndex];
      } else {
        faces.F[fIndex] = tempR[rIndex];
        faces.R[rIndex] = tempB[bIndex];
        faces.B[bIndex] = tempL[lIndex];
        faces.L[lIndex] = tempF[fIndex];
      }
    }
  }

  // Rotate the Up or Down face if it's an outer slice
  if (layer === 2) {
    faces.U = rotateMatrix(faces.U, -direction as 1 | -1);
  } else if (layer === 0) {
    faces.D = rotateMatrix(faces.D, -direction as 1 | -1);
  }
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

    if (direction === -1) {
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
    faces.F = rotateMatrix(faces.F, -direction as 1 | -1);
  } else if (layer === 0) {
    faces.B = rotateMatrix(faces.B, direction as 1 | -1);
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
      console.log("before rotate: ", state.moves);
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

      if (axis === "x") {
        rotateX(newFaces, layer, direction);
      } else if (axis === "y") {
        rotateY(newFaces, layer, direction);
      } else {
        rotateZ(newFaces, layer, direction);
      }
      state.moves.push({ axis, layer, direction });

      state.faces = newFaces;
    },
    shuffle: (state, action: PayloadAction<void>) => {
      state.moves = [];
      // For example, perform 20 random moves
      const axes: ("x" | "y" | "z")[] = ["x", "y", "z"];
      for (let i = 0; i < SHUFFLE_MOVES; i++) {
        const axis = axes[Math.floor(Math.random() * axes.length)];
        const layer = Math.random() < 0.5 ? 0 : 2; // layer: 0 or 2
        const direction = Math.random() < 0.5 ? 1 : -1;

        // We modify the state's faces in place by calling the appropriate rotation.
        if (axis === "x") {
          rotateX(state.faces, layer, direction);
        } else if (axis === "y") {
          rotateY(state.faces, layer, direction);
        } else {
          rotateZ(state.faces, layer, direction);
        }
        state.moves.push({ axis, layer, direction });
      }
      console.log("Shuffled cube: ", rotationArrayToString(state.moves));
    },
    solve: (state, action: PayloadAction<void>) => {
      const moves: Move[] = solveCube(state.moves);
      state.pendingMoves = moves;
      state.moves = [];
      console.log("After solve: ", state.moves);
    },
    // An action to remove the first pending move after it is finished.
    shiftPendingMove: (state) => {
      state.pendingMoves.shift();
    },
    // (Optionally, you might add an action to clear the pending moves.)
    clearPendingMoves: (state) => {
      state.pendingMoves = [];
    },
  },
});

export const {
  rotateLayer,
  shuffle,
  solve,
  shiftPendingMove,
  clearPendingMoves,
} = cubeSlice.actions;
export default cubeSlice.reducer;
