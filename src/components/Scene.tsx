import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Canvas, extend } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import RubikCube from "./RubikCube";

// Extend THREE with the components you're using
extend({ THREE });

export default function Scene() {
  const orbitRef = useRef(null);
  const [isDraggingCube, setIsDraggingCube] = useState(false);

  const handlePointerDown = (event: { intersections: string | any[] }) => {
    if (event.intersections.length > 0) {
      setIsDraggingCube(true);
    }
  };

  const handlePointerUp = () => {
    setIsDraggingCube(false);
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
      <Canvas
        style={{ width: "100%", height: "100%" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
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
        <RubikCube />
        <OrbitControls
          ref={orbitRef}
          enableZoom={false}
          rotateSpeed={0.8}
          enabled={!isDraggingCube}
        />
      </Canvas>
    </div>
  );
}
