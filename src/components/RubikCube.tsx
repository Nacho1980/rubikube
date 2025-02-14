import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Cubie from "./Cubie";

const cubeSize = 3;

export interface HighlightedLayer {
  axis: "x" | "y" | "z";
  layer: number; // 0,1,2
  direction: 1 | -1; // +1 or -1
}

interface RubikCubeProps {
  highlightedLayer?: HighlightedLayer | null;
  rotationProgress?: number; // fraction of a 90° turn (0..1)
}

const RubikCube: React.FC<RubikCubeProps> = ({
  highlightedLayer = null,
  rotationProgress = 0,
}) => {
  const faces = useSelector((state: RootState) => state.cube.faces);

  const staticCubies: JSX.Element[] = [];
  const rotatingCubies: JSX.Element[] = [];

  // Loop over grid coordinates 0..2
  for (let x = 0; x < cubeSize; x++) {
    for (let y = 0; y < cubeSize; y++) {
      for (let z = 0; z < cubeSize; z++) {
        const key = `cubie-${x}-${y}-${z}`;
        let inRotatingLayer = false;

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

        if (inRotatingLayer) rotatingCubies.push(cubieEl);
        else staticCubies.push(cubieEl);
      }
    }
  }

  // Center the entire cube by moving it back by half its size
  const centerOffset: [number, number, number] = [-1, -1, -1];

  // If no layer is rotating, render the entire centered cube
  if (!highlightedLayer) {
    return <group position={centerOffset}>{staticCubies}</group>;
  }

  // Calculate rotation for the active layer
  const { axis, layer, direction } = highlightedLayer;
  const angle = direction * rotationProgress * (Math.PI / 2);

  // Set up rotation axis
  const rotationVector: [number, number, number] =
    axis === "x" ? [angle, 0, 0] : axis === "y" ? [0, angle, 0] : [0, 0, angle];

  return (
    <group position={centerOffset}>
      {/* Static cubies */}
      {staticCubies}

      {/* Rotating layer */}
      <group>
        {/* Position at cube center */}
        <group position={[1, 1, 1]}>
          {/* Apply rotation */}
          <group rotation={rotationVector}>
            {/* Move back to original position */}
            <group position={[-1, -1, -1]}>{rotatingCubies}</group>
          </group>
        </group>
      </group>
    </group>
  );
};

export default RubikCube;
