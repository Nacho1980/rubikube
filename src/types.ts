// src/types/index.ts

// A single face is represented by 9 stickers (colors) in row-major order
export interface CubeFaceGrid {
  stickers: string[]; // should have length 9
}

// The cube has six faces identified by standard notation
export interface CubeFaces {
  U: CubeFaceGrid; // Up
  D: CubeFaceGrid; // Down
  F: CubeFaceGrid; // Front
  B: CubeFaceGrid; // Back
  L: CubeFaceGrid; // Left
  R: CubeFaceGrid; // Right
}

// The overall cube state
export interface CubeState {
  faces: CubeFaces;
}
