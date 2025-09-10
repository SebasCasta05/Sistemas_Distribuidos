// HeaderComponents.jsx
import "./HeaderComponents.css"
import { Link } from "react-router-dom"

function HeaderComponents() {
  return (
    <header className="header">
      <h1>MyUniversity</h1>
      <nav className="nav-bar">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Registro</Link></li>
          <li><Link to="/profile">Perfil</Link></li> {}
        </ul>
      </nav>
    </header>
  )
}

export default HeaderComponents
