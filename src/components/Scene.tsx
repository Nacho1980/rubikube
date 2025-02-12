import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as THREE from "three";
import { rotateLayer } from "../reducers/cubeSlice";
import { CubeState } from "../types";
import RubikCube from "./RubikCube";

interface SceneContentsProps {
  isDraggingCube: boolean;
  onPointerDown: (
    event: THREE.Event & { intersections: THREE.Intersection[] }
  ) => void;
  onPointerMove: (
    event: THREE.Event & { intersections: THREE.Intersection[] }
  ) => void;
  onPointerUp: (event: THREE.Event) => void;
}

const SceneContents: React.FC<SceneContentsProps> = ({
  isDraggingCube,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) => {
  const orbitRef = useRef<any>(null);
  const { camera } = useThree();

  /*   useEffect(() => {
    if (camera) {
      (camera as THREE.OrthographicCamera).zoom = 0.85;
      camera.updateProjectionMatrix();
    }
  }, [camera]); */

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
        enabled={isDraggingCube} // Only rotate when right-clicking
      />
    </>
  );
};

type FaceKey = keyof CubeState["faces"];

const getFaceFromNormal = (normal: THREE.Vector3): FaceKey | null => {
  const absX = Math.abs(normal.x);
  const absY = Math.abs(normal.y);
  const absZ = Math.abs(normal.z);

  if (absX > absY && absX > absZ) {
    return normal.x > 0 ? "R" : "L";
  } else if (absY > absX && absY > absZ) {
    return normal.y > 0 ? "U" : "D";
  } else if (absZ > absX && absZ > absY) {
    return normal.z > 0 ? "F" : "B";
  }
  return null;
};

interface DragState {
  x: number;
  y: number;
}

interface SelectedFaceState {
  face: FaceKey;
  normal: THREE.Vector3;
}

const Scene: React.FC = () => {
  const dispatch = useDispatch();
  const [isDraggingCube, setIsDraggingCube] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<DragState | null>(null);
  const [selectedFace, setSelectedFace] = useState<SelectedFaceState | null>(
    null
  );

  const handlePointerDown = (
    event: THREE.PointerEvent & { intersections: THREE.Intersection[] }
  ) => {
    event.stopPropagation();

    if (event.intersections.length > 0 && event.button === 0) {
      const intersection = event.intersections[0];
      if (!intersection.face) {
        setIsDraggingCube(true);
        return;
      }

      const normal = intersection.face.normal.clone();
      normal.transformDirection(intersection.object.matrixWorld);

      const face = getFaceFromNormal(normal);
      if (face) {
        setDragStart({ x: event.clientX, y: event.clientY });
        setSelectedFace({ face, normal });
      }
    }
  };

  const handlePointerMove = (
    event: THREE.PointerEvent & { intersections: THREE.Intersection[] }
  ) => {
    if (dragStart && selectedFace) {
      event.stopPropagation();

      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      const threshold = 5;

      if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        const { face } = selectedFace;
        let clockwise = false;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal drag
          clockwise = face === "F" ? deltaX > 0 : deltaX < 0;
        } else {
          // Vertical drag
          clockwise = face === "U" ? deltaY > 0 : deltaY < 0;
        }

        dispatch(
          rotateLayer({
            axis:
              face === "U" || face === "D"
                ? "y"
                : face === "L" || face === "R"
                ? "x"
                : "z",
            layer: face === "U" || face === "L" || face === "F" ? 1 : -1,
            direction: clockwise ? 1 : -1,
          })
        );

        setDragStart(null);
        setSelectedFace(null);
      }
    }
  };

  const handlePointerUp = (event: THREE.Event) => {
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
