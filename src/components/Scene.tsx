import { Canvas } from "@react-three/fiber";
import React from "react";
import SceneContents from "./SceneContents";

const Scene: React.FC = () => {
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
        {/* Render the real scene inside the Canvas */}
        <SceneContents />
      </Canvas>
    </div>
  );
};

export default Scene;
