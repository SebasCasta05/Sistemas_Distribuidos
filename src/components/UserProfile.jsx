import { useState } from "react"
import "./UserProfile.css"

function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)

  // Datos simulados (puedes traerlos luego de backend)
  const [user, setUser] = useState({
    name: "Juan Pérez",
    email: "juanperez@example.com",
    carrera: "Ingeniería de Sistemas"
  })

  const [formData, setFormData] = useState({ ...user })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData({ ...user }) // restaurar datos
    setIsEditing(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    setUser({ ...formData })
    setIsEditing(false)
    alert("✅ Datos actualizados correctamente")
  }

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Perfil del Usuario</h2>

        {isEditing ? (
          <form onSubmit={handleSave}>
            <div className="input-group">
              <label>Nombre</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Carrera</label>
              <input 
                type="text" 
                value={formData.carrera}
                onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn-save">Guardar</button>
              <button type="button" className="btn-cancel" onClick={handleCancel}>Cancelar</button>
            </div>
          </form>
        ) : (
          <div className="user-info">
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Carrera:</strong> {user.carrera}</p>
            <button onClick={handleEdit} className="btn-edit">Editar</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
