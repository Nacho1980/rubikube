/// <reference path="../types/global.d.ts" />
import "@react-three/fiber";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Cubie from "./Cubie";

const cubeSize = 3;
const spacing = 1.02; // Minimized spacing to resemble a real cube

const RubikCube: React.FC = () => {
  const cubeFaces = useSelector((state: RootState) => state.cube.faces);

  return (
    <group scale={4}>
      {Array.from({ length: cubeSize }).map((_, x) =>
        Array.from({ length: cubeSize }).map((_, y) =>
          Array.from({ length: cubeSize }).map((_, z) => (
            <Cubie
              key={`${x}-${y}-${z}`}
              position={[x - 1, y - 1, z - 1]}
              stickers={{
                U: cubeFaces.U.stickers[x + y * 3],
                D: cubeFaces.D.stickers[x + y * 3],
                F: cubeFaces.F.stickers[x + z * 3],
                B: cubeFaces.B.stickers[x + z * 3],
                L: cubeFaces.L.stickers[y + z * 3],
                R: cubeFaces.R.stickers[y + z * 3],
              }}
            />
          ))
        )
      )}
    </group>
  );
};

export default RubikCube;
