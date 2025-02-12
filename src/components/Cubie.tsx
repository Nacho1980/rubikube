import { Text } from "@react-three/drei";
import { BLACK } from "../constants";

/**
 * Represents a single cubie in the Rubik's Cube.
 */
const Cubie: React.FC<{
  position: [number, number, number];
  stickers: Partial<Record<"U" | "D" | "F" | "B" | "L" | "R", string[]>>;
}> = ({ position, stickers }) => {
  const [x, y, z] = position;

  // Determines if a face is external
  const isExternalFace = {
    U: y === 2,
    D: y === 0,
    F: z === 2,
    B: z === 0,
    L: x === 0,
    R: x === 2,
  };

  // Get color based on the face and position
  const getColorForFace = (face: "U" | "D" | "F" | "B" | "L" | "R") => {
    let col = BLACK;
    if (!isExternalFace[face]) {
      col = BLACK; // Interior faces are black
    } else {
      const indexMap = {
        U: x + 3 * y,
        D: x + 3 * y,
        F: x + 3 * z,
        B: x + 3 * z,
        L: z + 3 * y,
        R: z + 3 * y,
      };

      col = stickers[face]?.[indexMap[face]] || BLACK;
    }
    //console.log(stickers[face]);
    //console.log(face, x, y, z, col);
    return col;
  };
  // Order in which materials are assigned to faces of box in Three
  const faceOrder = ["R", "L", "U", "D", "F", "B"];
  const isDebugging = false;

  return (
    <group position={[x, y, z]} key={"group" + x + "-" + y + "-" + z}>
      <mesh castShadow receiveShadow key={"mesh" + x + "-" + y + "-" + z}>
        <boxGeometry
          args={[0.98, 0.98, 0.98]}
          key={"box" + x + "-" + y + "-" + z}
        />
        {faceOrder.map((face, i) => (
          <>
            <meshStandardMaterial
              key={"material" + face + x + "-" + y + "-" + z}
              attach={`material-${i}`}
              color={getColorForFace(face)}
              emissive={getColorForFace(face)}
              emissiveIntensity={0.6}
              metalness={0.3}
              roughness={0.5}
              depthWrite={true}
              depthTest={true}
            />
            {/* Add text labels to all external faces */}
            {isDebugging && isExternalFace[face] ? (
              <Text
                key={"text" + face + x + "-" + y + "-" + z}
                position={
                  {
                    U: [0, 0.51, 0],
                    D: [0, -0.51, 0],
                    F: [0, 0, 0.51],
                    B: [0, 0, -0.51],
                    L: [-0.51, 0, 0],
                    R: [0.51, 0, 0],
                  }[face]
                }
                rotation={
                  {
                    U: [Math.PI / 2, 0, 0],
                    D: [-Math.PI / 2, 0, 0],
                    F: [0, 0, 0],
                    B: [0, Math.PI, 0],
                    L: [0, -Math.PI / 2, 0],
                    R: [0, Math.PI / 2, 0],
                  }[face]
                }
                fontSize={0.2}
                color="purple"
                anchorX="center"
                anchorY="middle"
              >
                {face}({x},{y},{z})
              </Text>
            ) : null}
          </>
        ))}
      </mesh>
    </group>
  );
};

export default Cubie;
