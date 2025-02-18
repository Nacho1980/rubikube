import { Edges } from "@react-three/drei";
import React from "react";
import { BLACK } from "../constants";
import { Faces } from "../types";
import { getDisplayIndex } from "../utils/utils";
// type ThreeElement = THREE.Object3D;

interface CubieProps {
  position: [number, number, number];
  faces: Faces; // Each face is just string[9], no orientation
  highlighted?: boolean;
}

const Cubie: React.FC<CubieProps> = ({
  position,
  faces,
  highlighted = false,
}) => {
  const [x, y, z] = position;

  // We only show the sticker color if this cubie is on that face's outer side
  const isExternalFace = {
    U: y === 2,
    D: y === 0,
    F: z === 2,
    B: z === 0,
    L: x === 0,
    R: x === 2,
  };

  // For each face, find which sticker index corresponds to (x,y,z),
  // and read that sticker from faces[face].
  const getColorForFace = (face: keyof Faces) => {
    if (!isExternalFace[face]) return BLACK;
    const index = getDisplayIndex(x, y, z, face);
    return faces[face][index] || BLACK;
  };

  // The order of materials on a boxGeometry is: +X, -X, +Y, -Y, +Z, -Z.
  // We'll map them to R, L, U, D, F, B for consistency.
  const faceOrder: (keyof Faces)[] = ["R", "L", "U", "D", "F", "B"];

  return (
    <group position={[x, y, z]}>
      {/* The main cubie geometry */}
      <mesh userData={{ position: [x, y, z] }}>
        <boxGeometry args={[0.98, 0.98, 0.98]} />
        {faceOrder.map((face, i) => {
          const color = getColorForFace(face);
          return (
            <meshStandardMaterial
              key={face}
              attach={`material-${i}`}
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
              metalness={0.3}
              roughness={0.5}
            />
          );
        })}
        {/* Add black edges around the cubie */}
        <Edges scale={1} threshold={15} color={BLACK} />
      </mesh>

      {/* Optional yellow wireframe if "highlighted" */}
      {highlighted && (
        <mesh>
          <boxGeometry args={[1.02, 1.02, 1.02]} />
          <meshBasicMaterial
            color="yellow"
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
};

export default Cubie;
