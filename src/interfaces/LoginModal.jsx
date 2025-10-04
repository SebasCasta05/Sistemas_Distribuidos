const LoginModal = ({
  loginData,
  handleLoginInputChange,
  handleLoginSubmit,
  setShowLoginModal,
}) => (
  <div className="modal">
    <div className="modal-content">
      <button className="modal-close" onClick={() => setShowLoginModal(false)}>✖</button>
      <div className="modal-header">
        <h2 className="modal-title">Iniciar Sesión</h2>
        <p className="modal-subtitle">Accede a tu cuenta para continuar</p>
      </div>
      <form onSubmit={handleLoginSubmit}>
        <label className="form-label">
          Email:
          <input
            type="email"
            name="email"
            className="form-input"
            value={loginData.email}
            onChange={handleLoginInputChange}
            required
          />
        </label>
        <label className="form-label">
          Contraseña:
          <input
            type="password"
            name="password"
            className="form-input"
            value={loginData.password}
            onChange={handleLoginInputChange}
            required
          />
        </label>
        <button type="submit" className="modal-button-primary">
          Ingresar
        </button>
      </form>
      <div className="modal-text-center">
        <p className="modal-text">¿No tienes cuenta?</p>
        <button className="modal-link">Regístrate</button>
      </div>
    </div>
  </div>
);

export default LoginModal;
