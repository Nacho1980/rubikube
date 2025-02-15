// src/types/index.ts

// A single face is represented by 9 stickers (colors) in row-major order
export interface CubeFaceGrid {
  stickers: string[]; // should have length 9
}

export interface FaceData {
  stickers: string[];
  orientation: number; // 0, 90, 180, 270
}

export interface Faces {
  U: string[];
  D: string[];
  F: string[];
  B: string[];
  L: string[];
  R: string[];
}
