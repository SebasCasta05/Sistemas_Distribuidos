import "../componentesCss/perfil.css"; // o como se llame tu archivo
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Perfil() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="perfil">
          {/* Información del usuario */}
          <div className="perfil__info">
            <img 
              src="/api/placeholder/120/120" 
              alt="Avatar del usuario" 
              className="perfil__avatar"
            />
            <div className="perfil__datos">
              <h2 className="perfil__nombre">Juan Pérez</h2>
              <p className="perfil__detalle">📧 juan.perez@email.com</p>
              <p className="perfil__detalle">🎓 Estudiante de Ingeniería</p>
              <p className="perfil__detalle">📅 Miembro desde: Enero 2024</p>
            </div>
          </div>

          {/* Acciones */}
          <div className="perfil__acciones">
            <button className="perfil__editar-btn">
              ✏️ Editar Perfil
            </button>
          </div>

          {/* Publicaciones */}
          <div className="perfil__posts">
            <h3 className="perfil__posts-title">📝 Mis Publicaciones</h3>
            <p className="perfil__posts-vacio">
              Aún no has realizado ninguna publicación.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Perfil;