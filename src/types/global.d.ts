/// <reference types="@react-three/fiber" />

import { ReactThreeFiber } from "@react-three/fiber";
import * as THREE from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements extends ReactThreeFiber.IntrinsicElements {
      mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      planeGeometry: ReactThreeFiber.Object3DNode<
        THREE.PlaneGeometry,
        typeof THREE.PlaneGeometry
      >;
      meshBasicMaterial: ReactThreeFiber.Object3DNode<
        THREE.MeshBasicMaterial,
        typeof THREE.MeshBasicMaterial
      >;
      ambientLight: ReactThreeFiber.Object3DNode<
        THREE.AmbientLight,
        typeof THREE.AmbientLight
      >;
      directionalLight: ReactThreeFiber.Object3DNode<
        THREE.DirectionalLight,
        typeof THREE.DirectionalLight
      >;
    }
  }
}
