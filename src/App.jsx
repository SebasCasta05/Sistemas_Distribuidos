import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./interfaces/inicio.jsx";
import Login from "./interfaces/Login.jsx";
import Register from "./interfaces/Register.jsx";
import Perfil from "./interfaces/Perfil.jsx";
import Muro from "./interfaces/muro.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/muro" element={<Muro />} />
      </Routes>
    </Router>
  );
}
//s
export default App;
