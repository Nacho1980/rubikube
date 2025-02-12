/// <reference path="../types/global.d.ts" />
import "@react-three/fiber";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Cubie from "./Cubie";

const cubeSize = 3;

const RubikCube: React.FC = () => {
  const cubeFaces = useSelector((state: RootState) => state.cube.faces);

  return (
    <group position={[-1, -1, -1]} scale={[2.5, 2.5, 2.5]}>
      {Array.from({ length: cubeSize }).map((_, x) =>
        Array.from({ length: cubeSize }).map((_, y) =>
          Array.from({ length: cubeSize }).map((_, z) => (
            <Cubie
              key={`${x}-${y}-${z}`}
              position={[x, y, z]}
              stickers={{
                U: cubeFaces.U.stickers,
                D: cubeFaces.D.stickers,
                F: cubeFaces.F.stickers,
                B: cubeFaces.B.stickers,
                L: cubeFaces.L.stickers,
                R: cubeFaces.R.stickers,
              }}
            />
          ))
        )
      )}
    </group>
  );
};

export default RubikCube;
