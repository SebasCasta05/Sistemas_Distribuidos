// src/pages/ProfilePage.jsx
import { useNavigate } from "react-router-dom"

function ProfilePage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    alert("Sesión cerrada 👋")
    navigate("/login") // Redirige al login
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Bienvenido 🎉</h2>
        <p className="mb-6 text-gray-600">
          Aquí podrás hacer publicaciones y comentarios.
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default ProfilePage
