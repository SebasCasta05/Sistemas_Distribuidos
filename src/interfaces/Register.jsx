import { Link } from "react-router-dom";
import "../componentesCss/register.css"; // o como se llame tu archivo
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Register() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="register-container">
          <h2 className="register-title">Crear Cuenta</h2>
          <form className="register-form">
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Ingresa tu nombre" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Apellido</label>
              <input 
                type="text" 
                id="apellido" 
                name="apellido" 
                placeholder="Ingresa tu apellido" 
                required 
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">dirección</label>
              <input 
                type="text" 
                id="direccion" 
                name="direccion" 
                placeholder="Calle 12 No. 12" 
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
              <button type="submit" className="register-btn">Registrarse</button>
              <Link to="/login" className="login-btn">Volver al Login</Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Register;