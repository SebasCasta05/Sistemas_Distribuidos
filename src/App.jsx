import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./interfaces/inicio.jsx";
import Login from "./interfaces/Login.jsx";
import Register from "./interfaces/Register.jsx";
import Perfil from "./interfaces/Perfil.jsx";
import Muro from "./interfaces/muro.jsx";
import Hilos from "./interfaces/Hilos.jsx";
import PerfilPublico from "./interfaces/PerfilPublico.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfil/:id" element={<PerfilPublico />} />
        <Route path="/muro" element={<Muro />} />
        <Route path="/hilos" element={<Hilos />} />
      </Routes>
    </Router>
  );
}

export default App;
