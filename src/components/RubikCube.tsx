// RubikCube.tsx
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Cubie from "./Cubie";

const cubeSize = 3;

export interface HighlightedLayer {
  axis: "x" | "y" | "z";
  layer: number;
  direction: 1 | -1;
}

interface RubikCubeProps {
  highlightedLayer?: HighlightedLayer | null;
  rotationProgress?: number; // Value between 0 and 1 (fraction of 90° rotation)
}

const RubikCube: React.FC<RubikCubeProps> = ({
  highlightedLayer = null,
  rotationProgress = 0,
}) => {
  const faces = useSelector((state: RootState) => state.cube.faces);
  return (
    // Offset so that cubie positions (0,1,2) are centered.
    <group position={[-1, -1, -1]} scale={[2.5, 2.5, 2.5]}>
      {Array.from({ length: cubeSize }).map((_, x) =>
        Array.from({ length: cubeSize }).map((_, y) =>
          Array.from({ length: cubeSize }).map((_, z) => {
            let inHighlightedLayer = false;
            if (highlightedLayer) {
              const { axis, layer } = highlightedLayer;
              if (axis === "x" && x === layer) inHighlightedLayer = true;
              if (axis === "y" && y === layer) inHighlightedLayer = true;
              if (axis === "z" && z === layer) inHighlightedLayer = true;
            }
            const cubieElement = (
              <Cubie
                key={`cubie-${x}-${y}-${z}`}
                position={[x, y, z]}
                faces={faces}
                highlighted={inHighlightedLayer}
              />
            );
            if (inHighlightedLayer && highlightedLayer) {
              // Compute the rotation angle with the proper sign.
              const angle =
                highlightedLayer.direction * rotationProgress * (Math.PI / 2);
              // Compute the pivot for this slice.
              let pivot: [number, number, number] = [1, 1, 1];
              if (highlightedLayer.axis === "x")
                pivot = [highlightedLayer.layer, 1, 1];
              else if (highlightedLayer.axis === "y")
                pivot = [1, highlightedLayer.layer, 1];
              else if (highlightedLayer.axis === "z")
                pivot = [1, 1, highlightedLayer.layer];
              let rotation: [number, number, number] = [0, 0, 0];
              if (highlightedLayer.axis === "x") rotation = [angle, 0, 0];
              else if (highlightedLayer.axis === "y") rotation = [0, angle, 0];
              else if (highlightedLayer.axis === "z") rotation = [0, 0, angle];
              return (
                <group key={`rotated-${x}-${y}-${z}`}>
                  {/* Pivot transform: translate so that the pivot is at the origin, rotate, then translate back */}
                  <group
                    position={[-pivot[0], -pivot[1], -pivot[2]]}
                    rotation={rotation}
                  >
                    <group position={pivot}>{cubieElement}</group>
                  </group>
                </group>
              );
            }
            return cubieElement;
          })
        )
      )}
    </group>
  );
};

export default RubikCube;
