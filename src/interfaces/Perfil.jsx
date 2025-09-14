import "../componentesCss/Perfil.css";
import Header from "./Header";
import Footer from "./Footer";

function Perfil() {
  return (
    <>
      <Header />

      <div className="perfil">
        {/* Información del usuario */}
        <section className="perfil__info">
          <img 
            src="https://via.placeholder.com/120" 
            alt="Foto de perfil" 
            className="perfil__avatar" 
          />
          <div className="perfil__datos">
            <h2 className="perfil__nombre">Juan Pérez</h2>
            <p className="perfil__detalle">📧 juanperez@email.com</p>
            <p className="perfil__detalle">🎓 Ingeniería de Sistemas</p>
            <p className="perfil__detalle">📍 Medellín, Colombia</p>
          </div>
        </section>

        {/* Publicaciones */}
        <section className="perfil__posts">
          <h3 className="perfil__posts-title">Publicaciones</h3>
          <div className="perfil__posts-contenedor">
            {/* Aquí en el futuro se listarán las publicaciones */}
            <p className="perfil__posts-vacio">Aún no has hecho publicaciones.</p>
          </div>
        </section>

        {/* Botón de editar perfil */}
        <div className="perfil__acciones">
          <button className="perfil__editar-btn">✏️ Editar Perfil</button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Perfil;
