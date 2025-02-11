/**
 * Represents a single cubie in the Rubik's Cube.
 */
const Cubie: React.FC<{
  position: [number, number, number];
  stickers: Partial<Record<"U" | "D" | "F" | "B" | "L" | "R", string>>;
}> = ({ position, stickers }) => {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[0.98, 0.98, 0.98]} />
      {(["U", "D", "F", "B", "L", "R"] as const).map((face, i) => (
        <meshStandardMaterial
          key={face}
          attach={`material-${i}`}
          color={stickers[face] || "black"}
          emissive={stickers[face] || "black"} // Adds brightness
          emissiveIntensity={0.6} // Strength of glow
          metalness={0.3} // Slight reflection
          roughness={0.5} // Keeps it from being too shiny
          depthWrite={true}
          depthTest={true}
        />
      ))}
    </mesh>
  );
};
export default Cubie;
