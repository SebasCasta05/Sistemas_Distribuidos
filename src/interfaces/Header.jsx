function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <span className="header__logo">MyUniversity</span>
      </div>
      <nav className="header__nav">
        <a href="#" className="header__link">
          <span role="img" aria-label="home">🏠</span> Inicio
        </a>
        <a href="#" className="header__link">
          <span role="img" aria-label="wall">🧱</span> Muro
        </a>
      </nav>
      <div className="header__right">
        <button className="header__login">
          <span role="img" aria-label="login">👤</span> Login
        </button>
      </div>
    </header>
  );
}

export default Header;