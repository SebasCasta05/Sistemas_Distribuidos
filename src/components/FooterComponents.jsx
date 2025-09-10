import './FooterComponents.css'

function FooterComponents() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} MyUniversity. Todos los derechos reservados.</p>
        <nav className="footer-nav">
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
          <a href="#">Contacto</a>
        </nav>
      </div>
    </footer>
  )
}

export default FooterComponents
