import { useState } from "react";
import { Link } from "react-router-dom";
import "../componentesCss/login.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

function Login() {
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      setMensaje("Inicio de sesión exitoso ✅");

      // Guardar usuario en localStorage
      // En Login.jsx, después de login exitoso
sessionStorage.setItem("user", JSON.stringify(data.user));


      setTimeout(() => {
        window.location.href = "/perfil";
      }, 1500);
    } catch (err) {
      setError("Error en la conexión con el servidor");
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="login-container">
          <h2 className="login-title">Iniciar Sesión</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input type="email" id="email" name="email" placeholder="ejemplo@email.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" name="password" placeholder="********" required />
            </div>
            <div className="button-group">
              <button type="submit" className="login-btn">Entrar</button>
              <Link to="/register" className="register-btn">Registrarse</Link>
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

export default Login;
