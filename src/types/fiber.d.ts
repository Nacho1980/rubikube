import { ReactThreeFiber } from "@react-three/fiber";
import * as THREE from "three";

declare module "@react-three/fiber" {
  interface ThreeElements {
    group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
    mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    boxGeometry: ReactThreeFiber.BufferGeometryNode<
      THREE.BoxGeometry,
      typeof THREE.BoxGeometry
    >;
    planeGeometry: ReactThreeFiber.BufferGeometryNode<
      THREE.PlaneGeometry,
      typeof THREE.PlaneGeometry
    >;
    meshStandardMaterial: ReactThreeFiber.MaterialNode<
      THREE.MeshStandardMaterial,
      typeof THREE.MeshStandardMaterial
    >;
    meshBasicMaterial: ReactThreeFiber.MaterialNode<
      THREE.MeshBasicMaterial,
      typeof THREE.MeshBasicMaterial
    >;
    ambientLight: ReactThreeFiber.LightNode<
      THREE.AmbientLight,
      typeof THREE.AmbientLight
    >;
    directionalLight: ReactThreeFiber.LightNode<
      THREE.DirectionalLight,
      typeof THREE.DirectionalLight
    >;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
      mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      boxGeometry: ReactThreeFiber.BufferGeometryNode<
        THREE.BoxGeometry,
        typeof THREE.BoxGeometry
      >;
      planeGeometry: ReactThreeFiber.BufferGeometryNode<
        THREE.PlaneGeometry,
        typeof THREE.PlaneGeometry
      >;
      meshStandardMaterial: ReactThreeFiber.MaterialNode<
        THREE.MeshStandardMaterial,
        typeof THREE.MeshStandardMaterial
      >;
      meshBasicMaterial: ReactThreeFiber.MaterialNode<
        THREE.MeshBasicMaterial,
        typeof THREE.MeshBasicMaterial
      >;
      ambientLight: ReactThreeFiber.LightNode<
        THREE.AmbientLight,
        typeof THREE.AmbientLight
      >;
      directionalLight: ReactThreeFiber.LightNode<
        THREE.DirectionalLight,
        typeof THREE.DirectionalLight
      >;
    }
  }
}
