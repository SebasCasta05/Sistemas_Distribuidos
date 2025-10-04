const PostCard = ({ post, handleContact, openImageViewer, cities, workModes }) => {
  return (
    <div className="post-card">
      {/* Mostrar imagen si es vivienda */}
      {post.img && (
        <div className="post-image-container">
          <img
            src={post.img}
            alt={post.titulo}
            className="post-image"
            onClick={() => openImageViewer([post.img], 0)}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="post-content">
        {/* Badge de categoría */}
        <span className={`post-category ${post.tipo_publicacion || 'vivienda'}`}>
          {post.tipo_publicacion === 'vivienda' ? '🏠 Vivienda' : '💼 Empleo'}
        </span>

        {/* Título */}
        <h3 className="post-title">{post.titulo}</h3>

        {/* Descripción */}
        <p className="post-description">{post.descripcion}</p>

        {/* Información específica según el tipo */}
        <div className="post-info">
          {post.tipo_publicacion === 'vivienda' || post.precio ? (
            <>
              <span>💰 ${parseFloat(post.precio).toLocaleString('es-CO')}/mes</span>
              <span>📍 {post.ubicacion}</span>
              <span>🏙️ {cities.find(c => c.value === post.ciudad)?.label || post.ciudad}</span>
            </>
          ) : (
            <>
              <span>💰 {post.salario}</span>
              <span>🏢 {post.empresa}</span>
              <span>💻 {workModes.find(w => w.value === post.modalidad)?.label || post.modalidad}</span>
              {post.estudios && <span>🎓 {post.estudios}</span>}
            </>
          )}
          {post.created_at && (
            <span>⏰ {formatTimestamp(post.created_at)}</span>
          )}
        </div>

        {/* Habilidades para empleos */}
        {post.habilidades_minimas && (
          <div className="post-skills">
            <strong>Habilidades:</strong>
            {post.habilidades_minimas.split(',').map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Botón de contacto */}
        <button 
          className="contact-button"
          onClick={() => handleContact(post.telefono)}
        >
          📞 Contactar
        </button>
      </div>
    </div>
  );
};

// Función helper para formatear tiempo (agrégala fuera del componente)
const formatTimestamp = (timestamp) => {
  const now = new Date();
  const postDate = new Date(timestamp);
  const diffMs = now - postDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'unos momentos';
  if (diffMins < 60) return `${diffMins} minutos`;
  if (diffHours < 24) return `${diffHours} horas`;
  if (diffDays === 1) return '1 día';
  return `${diffDays} días`;
};

export default PostCard;