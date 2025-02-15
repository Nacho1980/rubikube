import { Faces } from "../types";

// Convert between linear index and 2D coordinates on a face
export const linearToCoords = (idx: number): [number, number] => {
  return [Math.floor(idx / 3), idx % 3];
};

export const coordsToLinear = (row: number, col: number): number => {
  return row * 3 + col;
};

// For rotation: Maps 3D coordinates (x, y, z) to the correct index for a given face.
export const getRotationIndex = (
  x: number,
  y: number,
  z: number,
  face: keyof Faces
): number => {
  switch (face) {
    case "F": // Front face (x,y plane at z=2)
      return coordsToLinear(2 - y, 2 - z); // Changed: use z for horizontal position
    case "R": // Right face (y,z plane at x=2)
      return coordsToLinear(2 - y, z); // Keep as is
    case "B": // Back face (x,y plane at z=0)
      return coordsToLinear(2 - y, x); // Changed: use x directly
    case "L": // Left face (y,z plane at x=0)
      return coordsToLinear(2 - y, 2 - z); // Changed: mirror z
    case "U": // Up face (x,z plane at y=2)
      return coordsToLinear(z, x); // Keep as is
    case "D": // Down face (x,z plane at y=0)
      return coordsToLinear(2 - z, x); // Keep as is
    default:
      return 0;
  }
};

// For display: Maps 3D coordinates to face indices based on visual position
export const getDisplayIndex = (
  x: number,
  y: number,
  z: number,
  face: keyof Faces
): number => {
  switch (face) {
    case "F": // Front face (x,y plane at z=2)
      return coordsToLinear(2 - y, x); // Original mapping for display
    case "R": // Right face (y,z plane at x=2)
      return coordsToLinear(2 - y, z); // Original mapping for display
    case "B": // Back face (x,y plane at z=0)
      return coordsToLinear(2 - y, 2 - x); // Original mapping for display
    case "L": // Left face (y,z plane at x=0)
      return coordsToLinear(2 - y, 2 - z); // Original mapping for display
    case "U": // Up face (x,z plane at y=2)
      return coordsToLinear(z, x); // Original mapping for display
    case "D": // Down face (x,z plane at y=0)
      return coordsToLinear(2 - z, x); // Original mapping for display
    default:
      return 0;
  }
};
