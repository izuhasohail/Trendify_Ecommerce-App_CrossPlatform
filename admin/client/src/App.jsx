// import logo from './logo.svg';
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import Error from "./pages/Error/Error";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Admin />} />
        <Route exact path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
