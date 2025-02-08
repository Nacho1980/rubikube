import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";
import { RootState } from "../store/store";

const CubeFace: React.FC<{
  color: string;
  position: [number, number, number];
}> = ({ color, position }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.9, 0.9]} />
      <meshBasicMaterial
        attach="material"
        color={color}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const RubikCube: React.FC = () => {
  const cubeState = useSelector((state: RootState) => state.cube);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <OrbitControls />
      {cubeState.faces.map((face, index) => (
        <CubeFace key={index} color={face.color} position={face.position} />
      ))}
    </Canvas>
  );
};

export default RubikCube;
