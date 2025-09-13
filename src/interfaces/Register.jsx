import "../componentesCss/register.css";
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Register() {
  return (
    <>
      <Header />

      <div className="register-container">
        <h2 className="register-title">Crear Cuenta</h2>
        <form className="register-form">
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" name="name" placeholder="Ingresa tu nombre" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" name="email" placeholder="ejemplo@email.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" placeholder="********" required />
          </div>

          <div className="button-group">
            <button type="submit" className="register-btn">Registrarse</button>
            <button type="button" className="login-btn">Volver al Login</button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default Register;
