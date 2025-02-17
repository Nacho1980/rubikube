import { useDispatch } from "react-redux";
import "./App.css";
import Scene from "./components/Scene";
import { shuffle, solve } from "./reducers/cubeSlice";

function App() {
  const dispatch = useDispatch();
  return (
    <div className="app-container">
      <div className="title">
        <span className="text-blue">Ru</span>
        <span className="text-orange">bi</span>
        <span className="text-green">Ku</span>
        <span className="text-red">be</span>
      </div>
      <Scene />
      <div className="controls">
        <button className="btn shuffle" onClick={() => dispatch(shuffle())}>
          Shuffle
        </button>
        <button className="btn solve" onClick={() => dispatch(solve())}>
          Solve
        </button>
      </div>
    </div>
  );
}

export default App;
