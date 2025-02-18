import { Canvas } from "@react-three/fiber";
import React from "react";
import SceneContents from "./SceneContents";

const Scene: React.FC = () => {
  return (
    <div className="w-[80vw] h-[80vw] md:w-[80vh] md:h-[80vh] flex justify-center items-center">
      <Canvas className="w-full h-full">
        <SceneContents />
      </Canvas>
    </div>
  );
};

export default Scene;
