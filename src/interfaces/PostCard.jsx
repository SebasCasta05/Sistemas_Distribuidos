const PostCard = ({ post, handleContact, openImageViewer, cities, workModes }) => (
  <div className="post-card">
    <h3>{post.titulo}</h3>
    <p>{post.descripcion}</p>

    {post.tipo === "vivienda" ? (
      <>
        <p><strong>Precio:</strong> ${post.precio}</p>
        <p><strong>Ciudad:</strong> {cities.find(c => c.codigoMunicipio === post.ciudad)?.nombreCiudad}</p>
        <p><strong>Ubicación:</strong> {post.ubicacion}</p>
      </>
    ) : (
      <>
        <p><strong>Empresa:</strong> {post.empresa}</p>
        <p><strong>Salario:</strong> {post.salario}</p>
        <p><strong>Modalidad:</strong> {post.modalidad}</p>
      </>
    )}

    {post.img && (
      <img
        src={post.img}
        alt="Publicación"
        className="post-image"
        onClick={() => openImageViewer(post.img)}
      />
    )}

    <button onClick={() => handleContact(post.telefono)}>
      📞 Contactar
    </button>
  </div>
);

export default PostCard;
