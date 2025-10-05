import { useState } from "react";
import { Link } from "react-router-dom";
import "../componentesCss/login.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

function Login() {
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);

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
        setLoading(false);
        return;
      }

      setMensaje("Inicio de sesión exitoso ✅");

      sessionStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        window.location.href = "/perfil";
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
        <div className="login-container">
          <h2 className="login-title">Iniciar Sesión</h2>
          <form className="login-form" onSubmit={handleSubmit}>
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
                className="login-btn"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
              <Link to="/register" className="register-btn">
                Registrarse
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

export default Login;