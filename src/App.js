import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GamePage } from "./pages/GamePage";
import { MainPage } from "./pages/MainPage";

function App() {
  return (
    <Router basename="/dapp">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
