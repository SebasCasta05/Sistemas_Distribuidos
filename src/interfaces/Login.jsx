import "../componentesCss/login.css";
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Login() {
  return (
    <>
      <Header />   {/* ✅ Aquí se muestra el Header */}

      <div className="login-container">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form className="login-form">
          

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
  <button type="button" className="register-btn">Registrarsee</button>
</div>
        </form>
      </div>

      <Footer />   {/* ✅ Aquí se muestra el Footer */}
    </>
  );
}

export default Login;   
