import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import RubikCube from "./RubikCube";

// Separate component for the 3D scene contents
const SceneContents: React.FC<{
  isDraggingCube: boolean;
  onPointerDown: (event: THREE.PointerEvent) => void;
  onPointerMove: (event: THREE.PointerEvent) => void;
  onPointerUp: (event: THREE.PointerEvent) => void;
}> = ({ isDraggingCube, onPointerDown, onPointerMove, onPointerUp }) => {
  const orbitRef = useRef(null);
  const { camera } = useThree();

  // Adjust the camera zoom to make the cube slightly smaller
  useEffect(() => {
    if (camera) {
      (camera as THREE.OrthographicCamera).zoom = 0.85; // Adjust this value to make cube smaller/larger
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  return (
    <>
      <OrthographicCamera
        makeDefault
        position={[6, 6, 6]}
        left={-10}
        right={10}
        top={10}
        bottom={-10}
        near={0.01}
        far={100}
      />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <group
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <RubikCube />
      </group>
      <OrbitControls
        ref={orbitRef}
        enableZoom={false}
        rotateSpeed={0.8}
        enabled={!isDraggingCube}
      />
    </>
  );
};

const Scene: React.FC = () => {
  const [isDraggingCube, setIsDraggingCube] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectedFace, setSelectedFace] = useState<THREE.Intersection | null>(
    null
  );

  const handlePointerDown = (event: THREE.PointerEvent) => {
    // Prevent event from propagating to OrbitControls
    event.stopPropagation();

    if (event.intersections.length > 0) {
      setIsDraggingCube(true);
      setDragStart({ x: event.point.x, y: event.point.y });
      setSelectedFace(event.intersections[0]); // Store the intersected face
    }
  };

  const handlePointerMove = (event: THREE.PointerEvent) => {
    if (isDraggingCube && dragStart && selectedFace) {
      // Prevent event from propagating to OrbitControls
      event.stopPropagation();

      const deltaX = event.point.x - dragStart.x;
      const deltaY = event.point.y - dragStart.y;

      // Get the face normal in world coordinates
      const normal = selectedFace.face?.normal.clone();
      if (normal) {
        normal.transformDirection(selectedFace.object.matrixWorld);

        // Determine which axis of rotation to use based on the face normal
        // and the drag direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          console.log("Horizontal row rotation", deltaX > 0 ? "right" : "left");
          // Here you would implement the actual cube row rotation
          // based on the selected face and drag direction
        } else {
          console.log("Vertical column rotation", deltaY > 0 ? "down" : "up");
          // Here you would implement the actual cube column rotation
          // based on the selected face and drag direction
        }
      }

      setDragStart({ x: event.point.x, y: event.point.y });
    }
  };

  const handlePointerUp = (event: THREE.PointerEvent) => {
    event.stopPropagation();
    setIsDraggingCube(false);
    setDragStart(null);
    setSelectedFace(null);
  };

  return (
    <div
      style={{
        width: "60vh",
        height: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Canvas style={{ width: "100%", height: "100%" }}>
        <SceneContents
          isDraggingCube={isDraggingCube}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      </Canvas>
    </div>
  );
};

export default Scene;
