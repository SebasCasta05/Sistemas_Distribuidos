import { Link } from "react-router-dom";
import "../componentesCss/login.css";
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Login() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="login-container">
          <h2 className="login-title">Iniciar Sesión</h2>
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="ejemplo@email.com" 
                required 
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
              />
            </div>

            <div className="button-group">
              <button type="submit" className="login-btn">Entrar</button>
              <Link to="/register" className="register-btn">Registrarse</Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Login;