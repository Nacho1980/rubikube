import React from "react";
import { BLACK } from "../constants";

interface FaceData {
  stickers: string[];
}
interface Faces {
  U: FaceData;
  D: FaceData;
  F: FaceData;
  B: FaceData;
  L: FaceData;
  R: FaceData;
}

interface CubieProps {
  position: [number, number, number];
  faces: Faces;
  highlighted?: boolean;
}

const Cubie: React.FC<CubieProps> = ({
  position,
  faces,
  highlighted = false,
}) => {
  const [x, y, z] = position;

  // Only show color on faces that are "exposed"
  const isExternalFace = {
    U: y === 2,
    D: y === 0,
    F: z === 2,
    B: z === 0,
    L: x === 0,
    R: x === 2,
  };

  // Map each face to an index in that face’s 3×3 array
  const getColorForFace = (face: keyof Faces) => {
    if (!isExternalFace[face]) return BLACK;
    const indexMap = {
      U: x + 3 * (2 - z),
      D: x + 3 * z,
      F: x + 3 * (2 - y),
      B: 2 - x + 3 * (2 - y),
      L: z + 3 * (2 - y),
      R: 2 - z + 3 * (2 - y),
    } as const;

    return faces[face].stickers[indexMap[face]] || BLACK;
  };

  const faceOrder: (keyof Faces)[] = ["R", "L", "U", "D", "F", "B"];

  return (
    <group position={[x, y, z]}>
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
      </mesh>
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
