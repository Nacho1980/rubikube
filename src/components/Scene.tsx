import { Canvas } from "@react-three/fiber";
import React from "react";
import SceneContents from "./SceneContents";

const Scene: React.FC = () => {
  return (
    <div className="scene-container">
      <Canvas className="canvas">
        <SceneContents />
      </Canvas>
    </div>
  );
};

export default Scene;
