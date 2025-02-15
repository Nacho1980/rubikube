import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Cubie from "./Cubie";

// The size of each dimension in our 3x3x3 cube
const cubeSize = 3;

export interface HighlightedLayer {
  axis: "x" | "y" | "z";
  layer: number; // which slice (0..2)
  direction: 1 | -1; // clockwise or counterclockwise
}

interface RubikCubeProps {
  highlightedLayer?: HighlightedLayer | null;
  rotationProgress?: number; // fraction of a 90° turn (0..1)
}

const RubikCube: React.FC<RubikCubeProps> = ({
  highlightedLayer = null,
  rotationProgress = 0,
}) => {
  // Get the 6 faces from Redux. Each face is just an array of 9 stickers.
  const faces = useSelector((state: RootState) => state.cube.faces);

  const staticCubies: JSX.Element[] = [];
  const rotatingCubies: JSX.Element[] = [];

  // Build the 27 cubies (x,y,z from 0..2)
  for (let x = 0; x < cubeSize; x++) {
    for (let y = 0; y < cubeSize; y++) {
      for (let z = 0; z < cubeSize; z++) {
        const key = `cubie-${x}-${y}-${z}`;
        let inRotatingLayer = false;

        // If there's an active highlighted layer, see if (x,y,z) is in it
        if (highlightedLayer) {
          const { axis, layer } = highlightedLayer;
          if (
            (axis === "x" && x === layer) ||
            (axis === "y" && y === layer) ||
            (axis === "z" && z === layer)
          ) {
            inRotatingLayer = true;
          }
        }

        const cubieEl = (
          <Cubie
            key={key}
            position={[x, y, z]}
            faces={faces}
            highlighted={inRotatingLayer}
          />
        );

        // We separate rotating cubies into a separate group for animation
        if (inRotatingLayer) rotatingCubies.push(cubieEl);
        else staticCubies.push(cubieEl);
      }
    }
  }

  // Shift the entire cube so that its center is at (0,0,0)
  const centerOffset: [number, number, number] = [-1, -1, -1];

  // If no layer is rotating, just render all cubies in a single group
  if (!highlightedLayer) {
    return <group position={centerOffset}>{staticCubies}</group>;
  }

  // We do have a highlighted layer, so we animate that slice
  const { axis, direction } = highlightedLayer;
  const angle = direction * rotationProgress * (Math.PI / 2);

  // Convert axis name to Euler angles
  const rotationVector: [number, number, number] =
    axis === "x" ? [angle, 0, 0] : axis === "y" ? [0, angle, 0] : [0, 0, angle];

  return (
    <group position={centerOffset}>
      {/* The static cubies (all layers not currently rotating) */}
      {staticCubies}

      {/* The rotating slice, pivoted around the center of the cube */}
      <group>
        {/* Move pivot to cube center (which is +1 in x,y,z from the corner) */}
        <group position={[1, 1, 1]}>
          {/* Apply the rotation to the slice */}
          <group rotation={rotationVector}>
            {/* Move the slice back so the cubies appear in correct spots */}
            <group position={[-1, -1, -1]}>{rotatingCubies}</group>
          </group>
        </group>
      </group>
    </group>
  );
};

export default RubikCube;
