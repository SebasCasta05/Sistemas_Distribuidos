import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./LoginPage.css"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate() // 👈 Para redirigir

  const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (res.ok) {
      alert("Login exitoso")
      navigate("/Muro") // 👈 Redirige si el login fue correcto
    } else {
      alert(data.error || "Error en el login")
    }
  } catch (error) {
    console.error("Error en la conexión:", error)
    alert("No se pudo conectar con el servidor")
  }
}


  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Ingrese su correo"
              required
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
          <button type="submit">Ingresar</button>
          <button 
            type="button" 
            onClick={() => navigate("/register")}
            style={{ marginLeft: "10px", background: "#3f92db", color: "#fff" }}
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage


