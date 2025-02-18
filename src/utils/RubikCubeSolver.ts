// RubikCubeSolver.ts
import Cube from "cubejs"; // cubejs exports a Cube class
import { BLUE, GREEN, ORANGE, RED, WHITE, YELLOW } from "../constants";
import { Faces, Move } from "../types";

// IMPORTANT: Initialize the cubejs solver once.
// You can do this on module load or in your app's initialization logic.
Cube.initSolver();

export const isCubeSolved = (faces: Faces): boolean => {
  const expectedColors: Record<keyof Faces, string> = {
    U: WHITE,
    D: YELLOW,
    F: GREEN,
    B: BLUE,
    L: ORANGE,
    R: RED,
  };

  const faceKeys: (keyof Faces)[] = ["U", "D", "F", "B", "L", "R"];

  return faceKeys.every((face) =>
    faces[face].every((sticker) => sticker === expectedColors[face])
  );
};

/**
 * Converts our internal cube state into a 54-character string that cubejs understands.
 * The cubejs solver expects the cube to be represented using the face letters:
 * U (up), R (right), F (front), D (down), L (left), B (back).
 */
const cubeStateToString = (faces: Faces): string => {
  // Helper that maps a face's color to the correct letter.
  const mapColor = (color: string) => {
    switch (color) {
      case WHITE:
        return "U";
      case RED:
        return "R";
      case GREEN:
        return "F";
      case YELLOW:
        return "D";
      case ORANGE:
        return "L";
      case BLUE:
        return "B";
    }
  };
  const mapColorsReverseRow = (colors: string[]): string => {
    let newColors = "";
    for (let i = 0; i < 3; i++) {
      for (let j = 2; j >= 0; j--) {
        newColors += mapColor(colors[i * 3 + j]);
      }
    }
    return newColors;
  };

  return (
    faces.U.map((c) => mapColor(c)).join("") +
    mapColorsReverseRow(faces.R) +
    faces.F.map((c) => mapColor(c)).join("") +
    faces.D.map((c) => mapColor(c)).join("") +
    mapColorsReverseRow(faces.L) +
    faces.B.map((c) => mapColor(c)).join("")
  );
};

/**
 * Converts a single move into a string with standard notation that cubejs understands.
 * For example, { axis: "x", layer: 2, direction: 1 } becomes "R".
 * For a counterclockwise move, the direction is -1, and we append "'" to the face.
 * For example, { axis: "x", layer: 2, direction: -1 } becomes "R'".
 * For a double move, the direction is 1 and we append "2" to the face.
 * For example, { axis: "x", layer: 2, direction: 1 } becomes "R2".
 **/
const moveToString = (move: Move): string => {
  const { axis, layer, direction } = move;
  let face: string = "";

  // Determine the face letter based on the axis and which layer is turned.
  if (axis === "x") {
    if (layer === 2) {
      face = "R";
    } else if (layer === 0) {
      face = "L";
    } else {
      // Middle slice along the x-axis. You can choose how to handle this.
      face = "M"; // Optional: some notations use 'M'
    }
  } else if (axis === "y") {
    if (layer === 2) {
      face = "U";
    } else if (layer === 0) {
      face = "D";
    } else {
      // Middle slice along the y-axis.
      face = "E"; // Optional: some notations use 'E'
    }
  } else if (axis === "z") {
    if (layer === 2) {
      face = "F";
    } else if (layer === 0) {
      face = "B";
    } else {
      // Middle slice along the z-axis.
      face = "S"; // Optional: some notations use 'S'
    }
  }

  // For a quarter-turn move, cubejs expects just the face letter for clockwise,
  // and face + "'" for anticlockwise. We don't include a trailing "1".
  // direction 1 is ' for x
  const isPrime =
    (direction === 1 && face === "R") ||
    (direction === -1 && face === "L") ||
    (direction === -1 && face === "M") ||
    (direction === 1 && face === "U") ||
    (direction === -1 && face === "D") ||
    (direction === -1 && face === "E") ||
    (direction === 1 && face === "F") ||
    (direction === 1 && face === "S") ||
    (direction === -1 && face === "B");
  return face + (isPrime ? "'" : "");
};

export const rotationArrayToString = (moves: Move[]): string => {
  if (moves.length === 0) {
    return "";
  }
  return moves.map(moveToString).join(" ");
};

/**
 * Parses a standard solution string (e.g., "R U R' U'") into our internal Move[] format.
 */
const parseSolution = (solution: string): Move[] => {
  if (solution.length === 0) {
    return [];
  }

  const tokens = solution.split(" ").filter((t) => t.length > 0);
  const moves: Move[] = [];

  tokens.forEach((token) => {
    const face = token[0];
    const isDouble = token.includes("2");
    const isPrime = token.includes("'");
    const createMove = (repeat: number = 1) => {
      let move: Move;
      switch (face) {
        case "U":
          move = { axis: "y", layer: 2, direction: isPrime ? 1 : -1 };
          break;
        case "D":
          move = { axis: "y", layer: 0, direction: isPrime ? -1 : 1 };
          break;
        case "F":
          move = { axis: "z", layer: 2, direction: isPrime ? 1 : -1 };
          break;
        case "B":
          move = { axis: "z", layer: 0, direction: isPrime ? -1 : 1 };
          break;
        case "R":
          move = { axis: "x", layer: 2, direction: isPrime ? 1 : -1 };
          break;
        case "L":
          move = { axis: "x", layer: 0, direction: isPrime ? -1 : 1 };
          break;
        default:
          throw new Error("Unknown face: " + face);
      }
      return Array(repeat).fill(move);
    };

    if (isDouble) {
      moves.push(...createMove(2));
    } else {
      moves.push(...createMove(1));
    }
  });
  return moves;
};

/**
 * solveCube takes the current cube state and returns a sequence of moves.
 */
const solveCube = (initialMoves: Move[]): Move[] => {
  let solution: string = "";
  try {
    const cube = new Cube();
    const alreadyMadeMoves = rotationArrayToString(initialMoves);
    cube.move(alreadyMadeMoves);
    if (cube.isSolved()) {
      console.log("Cube is already solved. No moves needed.");
    } else {
      solution = cube.solve();
    }
  } catch (e) {
    console.error("Error while solving cube:", e);
  }

  // Parse the solution string into our internal Move[] format.
  const moves = parseSolution(solution);
  return moves;
};

export default solveCube;
