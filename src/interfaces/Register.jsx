import { useState } from "react";
import { Link } from "react-router-dom";
import "../componentesCss/register.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

function Register() {
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const formData = {
  nombre: e.target.nombre.value.trim(),
  apellido: e.target.apellido.value.trim(),
  telefono: e.target.telefono.value.trim(),
  email: e.target.email.value.trim(),
  direccion: e.target.direccion.value.trim(),
  password: e.target.password.value.trim(),
  tipo_usuario: "estudiante", // o "admin"
};


    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al registrar usuario");
        return;
      }

      setMensaje("Usuario registrado correctamente ✅");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setError("Error en la conexión con el servidor");
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="register-container">
          <h2 className="register-title">Crear Cuenta</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input type="text" id="name" name="nombre" placeholder="Ingresa tu nombre" required />
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input type="text" id="apellido" name="apellido" placeholder="Ingresa tu apellido" required />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input type="text" id="telefono" name="telefono" placeholder="Ingresa tu teléfono" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input type="email" id="email" name="email" placeholder="ejemplo@email.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="direccion">Dirección</label>
              <input type="text" id="direccion" name="direccion" placeholder="Calle 12 No. 12" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" name="password" placeholder="********" required />
            </div>
            <div className="button-group">
              <button type="submit" className="register-btn">Registrarse</button>
              <Link to="/login" className="login-btn">Volver al Login</Link>
            </div>
          </form>
          {error && <p className="error">{error}</p>}
          {mensaje && <p className="success">{mensaje}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Register;
