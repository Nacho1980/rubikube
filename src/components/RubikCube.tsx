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
  rotationProgress?: number; // fraction of 90°
}

const RubikCube: React.FC<RubikCubeProps> = ({
  highlightedLayer = null,
  rotationProgress = 0,
}) => {
  const faces = useSelector((state: RootState) => state.cube.faces);

  return (
    /**
     * Shift the entire cube from (0..2)^3 to center it,
     * then scale it up to make it visible.
     */
    <group position={[-1, -1, -1]} scale={[2.5, 2.5, 2.5]}>
      {Array.from({ length: cubeSize }).map((_, x) =>
        Array.from({ length: cubeSize }).map((_, y) =>
          Array.from({ length: cubeSize }).map((_, z) => {
            const key = `cubie-${x}-${y}-${z}`;

            // Check if this cubie is in the slice being rotated
            let inHighlightedLayer = false;
            if (highlightedLayer) {
              const { axis, layer } = highlightedLayer;
              if (axis === "x" && x === layer) inHighlightedLayer = true;
              if (axis === "y" && y === layer) inHighlightedLayer = true;
              if (axis === "z" && z === layer) inHighlightedLayer = true;
            }

            // Normal cubie
            const cubie = (
              <Cubie
                key={key}
                position={[x, y, z]}
                faces={faces}
                highlighted={inHighlightedLayer}
              />
            );

            // If it's in the rotating slice, pivot it
            if (inHighlightedLayer && highlightedLayer) {
              const { axis, direction } = highlightedLayer;
              // angle from 0..90 degrees
              const angle = direction * rotationProgress * (Math.PI / 2);

              // The center of the face (layer) in original coords is (layer,1,1) if axis=x,
              // (1,layer,1) if axis=y, or (1,1,layer) if axis=z.
              // After offset by [-1,-1,-1], that becomes (layer-1, 0,0), (0,layer-1,0), or (0,0,layer-1).
              let pivot: [number, number, number] = [0, 0, 0];
              if (axis === "x") {
                pivot = [highlightedLayer.layer - 1, 0, 0];
              } else if (axis === "y") {
                pivot = [0, highlightedLayer.layer - 1, 0];
              } else if (axis === "z") {
                pivot = [0, 0, highlightedLayer.layer - 1];
              }

              // Axis of rotation
              let rotation: [number, number, number] = [0, 0, 0];
              if (axis === "x") rotation = [angle, 0, 0];
              if (axis === "y") rotation = [0, angle, 0];
              if (axis === "z") rotation = [0, 0, angle];

              return (
                <group key={`rotated-${x}-${y}-${z}`}>
                  <group
                    position={[-pivot[0], -pivot[1], -pivot[2]]}
                    rotation={rotation}
                  >
                    <group position={pivot}>{cubie}</group>
                  </group>
                </group>
              );
            }

            return cubie;
          })
        )
      )}
    </group>
  );
};

export default RubikCube;
