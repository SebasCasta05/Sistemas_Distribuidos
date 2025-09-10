import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css"
function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Solo mando nombre, email, password
      });

      if (res.ok) {
        alert("✅ Usuario registrado con éxito, inicia sesión ahora");
        navigate("/LoginPage");
      } else {
        const error = await res.json();
        alert("❌ Error: " + error.message);
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      alert("❌ Error en la conexión con el servidor");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Registro de Usuario
        </h2>

        {/* Nombre */}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Correo */}
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Contraseña */}
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
