declare module "cubejs" {
  interface Cube {
    solve(): string;
  }

  interface CubeStatic {
    initSolver(): void;
    fromString(cubeString: string): Cube;
  }

  const Cube: CubeStatic;
  export default Cube;
}
