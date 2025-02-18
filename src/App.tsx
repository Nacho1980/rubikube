import { useDispatch } from "react-redux";
import "./App.css";
import Scene from "./components/Scene";
import { shuffle, solve } from "./reducers/cubeSlice";

function App() {
  const dispatch = useDispatch();
  return (
    <div className="flex">
      {/* Title styled with Tailwind */}
      <div className="text-[4em] font-bold rotate-180 [writing-mode:vertical-rl]">
        <span className="text-blue-500">Ru</span>
        <span className="text-orange-500">bi</span>
        <span className="text-green-500">Ku</span>
        <span className="text-red-500">be</span>
      </div>
      <Scene />
      {/* Controls styled with Tailwind */}
      <div className="flex flex-col justify-center gap-4">
        <button
          className="text-white bg-green-500 hover:bg-green-300 py-2 px-4 rounded"
          onClick={() => dispatch(shuffle())}
        >
          Shuffle
        </button>
        <button
          className="text-white bg-blue-500 hover:bg-blue-300 py-2 px-4 rounded"
          onClick={() => dispatch(solve())}
        >
          Solve
        </button>
      </div>
    </div>
  );
}

export default App;
