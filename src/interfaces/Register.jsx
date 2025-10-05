import { useState } from "react";
import { Link } from "react-router-dom";
import "../componentesCss/register.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

function Register() {
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);

    const formData = {
      nombre: e.target.nombre.value.trim(),
      apellido: e.target.apellido.value.trim(),
      telefono: e.target.telefono.value.trim(),
      email: e.target.email.value.trim(),
      direccion: e.target.direccion.value.trim(),
      password: e.target.password.value.trim(),
      tipo_usuario: 1, // 🔹 Por defecto: "Usuario" (ajusta el ID según tu BD)
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
        setLoading(false);
        return;
      }

      setMensaje("Usuario registrado correctamente ✅");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setError("Error en la conexión con el servidor");
      setLoading(false);
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
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Ingresa tu nombre"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                placeholder="Ingresa tu apellido"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                placeholder="Ingresa tu teléfono"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ejemplo@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Calle 12 No. 12"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                required
                disabled={loading}
              />
            </div>

            <div className="button-group">
              <button
                type="submit"
                className="register-btn"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrarse"}
              </button>
              <Link to="/login" className="login-btn">
                Volver al Login
              </Link>
            </div>

            {error && <div className="error">{error}</div>}
            {mensaje && <div className="success">{mensaje}</div>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Register;
