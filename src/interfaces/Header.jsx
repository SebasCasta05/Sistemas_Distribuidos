import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className="header">
      <div className="header__left">
        <span className="header__logo">MyUniversity</span>
      </div>

      <nav className="header__nav">
        <a 
          href="#" 
          className="header__link"
          onClick={(e) => { e.preventDefault(); navigate("/"); }}
        >
          <span role="img" aria-label="home">🏠</span> Inicio
        </a>

        <a 
          href="#" 
          className="header__link"
          onClick={(e) => { e.preventDefault(); navigate("/muro"); }}
        >
          <span role="img" aria-label="wall">🧱</span> Muro
        </a>
        <a href="#"
          className="header__link"
          onClick={(e) => { e.preventDefault(); navigate("/hilos"); }}
        >
          <span role="img" aria-label="threads">💬</span> Hilo
        </a>
      </nav>

      <div className="header__right">
        {user ? (
          <button 
            className="header__login"
            onClick={() => navigate("/perfil")}
          >
            <span role="img" aria-label="profile">👤</span> Mi Perfil
          </button>
        ) : (
          <button 
            className="header__login"
            onClick={() => navigate("/login")}
          >
            <span role="img" aria-label="login">👤</span> Login
          </button>
        )}
      </div>
    </header>
  );
}
//s
export default Header;
