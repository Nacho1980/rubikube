import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as THREE from "three";
import { rotateLayer } from "../reducers/cubeSlice";
import RubikCube from "./RubikCube";

const ROTATION_SPEED = 0.02;
const DRAG_THRESHOLD = 5;

interface DragState {
  x: number;
  y: number;
  intersectsCube: boolean;
  cubiePosition?: [number, number, number];
  faceNormal?: THREE.Vector3;
}

const SceneContents: React.FC = () => {
  const [isDraggingCube, setIsDraggingCube] = useState(true);
  const [dragStart, setDragStart] = useState<DragState | null>(null);
  const [highlightedLayer, setHighlightedLayer] = useState<{
    axis: "x" | "y" | "z";
    layer: number;
    direction: 1 | -1;
  } | null>(null);
  const [rotationProgress, setRotationProgress] = useState(0);
  const rotationRef = useRef<{
    axis: "x" | "y" | "z";
    layer: number;
    direction: 1 | -1;
  } | null>(null);
  const dispatch = useDispatch();

  useFrame(() => {
    if (!rotationRef.current) return;
    setRotationProgress((prev) => {
      const newProgress = prev + ROTATION_SPEED;
      if (newProgress >= 1) {
        setTimeout(() => {
          if (rotationRef.current) {
            dispatch(rotateLayer(rotationRef.current));
            rotationRef.current = null;
          }
          setHighlightedLayer(null);
          setRotationProgress(0);
        }, 0);
        return 1;
      }
      return newProgress;
    });
  });

  const handlePointerDown = useCallback((event: any) => {
    event.stopPropagation();
    const intersect = event.intersections[0];
    const isCubie =
      intersect &&
      intersect.object.userData &&
      intersect.object.userData.position !== undefined;
    setIsDraggingCube(!isCubie);

    if (isCubie && intersect.face) {
      const cubiePosition = intersect.object.userData.position as [
        number,
        number,
        number
      ];
      const faceNormal = intersect.face.normal
        .clone()
        .transformDirection(intersect.object.matrixWorld);
      setDragStart({
        x: event.clientX,
        y: event.clientY,
        intersectsCube: true,
        cubiePosition,
        faceNormal,
      });
    } else {
      setDragStart({
        x: event.clientX,
        y: event.clientY,
        intersectsCube: false,
      });
    }
  }, []);

  const getRotationAxes = (faceNormal: THREE.Vector3) => {
    const tolerance = 0.9;
    if (Math.abs(faceNormal.z) > tolerance)
      return { horizontal: "y", vertical: "x" };
    if (Math.abs(faceNormal.x) > tolerance)
      return { horizontal: "y", vertical: "z" };
    if (Math.abs(faceNormal.y) > tolerance)
      return { horizontal: "x", vertical: "z" };
    return { horizontal: "y", vertical: "x" };
  };

  const handlePointerMove = useCallback(
    (event: any) => {
      if (!dragStart || rotationRef.current) return;
      if (
        dragStart.intersectsCube &&
        dragStart.faceNormal &&
        dragStart.cubiePosition
      ) {
        const deltaX = event.clientX - dragStart.x;
        const deltaY = event.clientY - dragStart.y;
        if (
          Math.abs(deltaX) > DRAG_THRESHOLD ||
          Math.abs(deltaY) > DRAG_THRESHOLD
        ) {
          const { horizontal, vertical } = getRotationAxes(
            dragStart.faceNormal
          );
          let chosenAxis: "x" | "y" | "z";
          let dragAmount: number;

          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            chosenAxis = horizontal;
            dragAmount = deltaX;
          } else {
            chosenAxis = vertical;
            dragAmount = deltaY;
            if (chosenAxis === "z" && Math.abs(dragStart.faceNormal.x) > 0.9) {
              dragAmount = -dragAmount;
            }
          }

          const direction = dragAmount > 0 ? 1 : -1;
          let layer = 0;
          if (chosenAxis === "x") layer = dragStart.cubiePosition[0];
          else if (chosenAxis === "y") layer = dragStart.cubiePosition[1];
          else if (chosenAxis === "z") layer = dragStart.cubiePosition[2];

          rotationRef.current = { axis: chosenAxis, layer, direction };
          setHighlightedLayer({ axis: chosenAxis, layer, direction });
          setDragStart(null);
        }
      }
    },
    [dragStart]
  );

  const handlePointerUp = useCallback(() => {
    setIsDraggingCube(true);
    setDragStart(null);
  }, []);

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

      <mesh
        position={[0, 0, -10]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
      </mesh>

      <group
        scale={[2.5, 2.5, 2.5]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <RubikCube
          highlightedLayer={highlightedLayer}
          rotationProgress={rotationProgress}
        />
      </group>

      <OrbitControls
        enableZoom={false}
        rotateSpeed={0.8}
        enabled={isDraggingCube}
      />
    </>
  );
};

export default SceneContents;
