import { Faces } from "../types";

// Convert between linear index and 2D coordinates on a face
export const linearToCoords = (idx: number): [number, number] => {
  return [Math.floor(idx / 3), idx % 3];
};

export const coordsToLinear = (row: number, col: number): number => {
  return row * 3 + col;
};

// Maps 3D coordinates (x, y, z) to the correct index for a given face.
export const getFaceIndex = (
  x: number,
  y: number,
  z: number,
  face: keyof Faces
): number => {
  switch (face) {
    case "F": // Front face
      return coordsToLinear(2 - y, x);
    case "R": // Right face
      return coordsToLinear(2 - y, z);
    case "B": // Back face
      return coordsToLinear(2 - y, 2 - x); // Mirror x coordinate
    case "L": // Left face
      return coordsToLinear(2 - y, 2 - z); // Mirror z coordinate
    case "U": // Up face
      return coordsToLinear(z, x);
    case "D": // Down face
      return coordsToLinear(2 - z, x);
    default:
      return 0;
  }
};
