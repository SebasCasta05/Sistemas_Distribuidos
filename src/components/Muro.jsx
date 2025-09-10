import { useState } from "react"
import "./Muro.css"

function Muro() {
  const [publicaciones, setPublicaciones] = useState([])
  const [texto, setTexto] = useState("")
  const [tipo, setTipo] = useState("General")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!texto.trim()) return

    const nuevaPublicacion = {
      id: Date.now(),
      nombreUsuario: "Usuario Demo", // 🔹 Aquí luego lo reemplazas con el usuario logueado
      fecha: new Date().toLocaleString(),
      tipoPublicacion: tipo,
      cuerpo: texto,
    }

    setPublicaciones([nuevaPublicacion, ...publicaciones])
    setTexto("")
    setTipo("General")
  }

  return (
    <div className="muro-container">
      <h2 className="muro-title">Muro de Publicaciones</h2>

      {/* Formulario para crear publicación */}
      <form className="publicacion-form" onSubmit={handleSubmit}>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu publicación aquí..."
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="General">General</option>
          <option value="Oferta laboral">Oferta laboral</option>
          <option value="Vivienda">Vivienda</option>
          <option value="Beca">Beca</option>
        </select>
        <button type="submit">Publicar</button>
      </form>

      {/* Lista de publicaciones */}
      {publicaciones.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>
          Aún no hay publicaciones.
        </p>
      ) : (
        publicaciones.map((pub) => (
          <div key={pub.id} className="publicacion-card">
            <div className="publicacion-header">
              <h4>{pub.nombreUsuario}</h4>
              <span>
                {pub.fecha} | {pub.tipoPublicacion}
              </span>
            </div>
            <div className="publicacion-body">{pub.cuerpo}</div>
            <div className="publicacion-footer">
              <button>Generar cadena</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Muro
