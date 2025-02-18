import { useDispatch } from "react-redux";
import "./App.css";
import Scene from "./components/Scene";
import { shuffle, solve } from "./reducers/cubeSlice";

function App() {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col md:flex-row max-w-full min-h-screen items-center justify-center bg-amber-100 px-4">
      {/* Title styled with Tailwind */}
      <div className="text-center text-[4em] font-bold md:rotate-180 [writing-mode:horizontal-tb] md:[writing-mode:vertical-rl] p-4 md:p-0 flex items-center">
        <span className="text-blue-500">Ru</span>
        <span className="text-orange-500">bi</span>
        <span className="text-green-500">Ku</span>
        <span className="text-red-500">be</span>
      </div>
      <Scene />
      {/* Controls styled with Tailwind */}
      <div className="flex w-full flex-row md:flex-col justify-center align-center gap-4 md:max-w-[25vw]">
        <button
          className="text-white bg-green-500 hover:bg-green-300 py-2 px-4 rounded w-full"
          onClick={() => dispatch(shuffle())}
        >
          Shuffle
        </button>
        <button
          className="text-white bg-blue-500 hover:bg-blue-300 py-2 px-4 rounded w-full"
          onClick={() => dispatch(solve())}
        >
          Solve
        </button>
      </div>
    </div>
  );
}

export default App;
