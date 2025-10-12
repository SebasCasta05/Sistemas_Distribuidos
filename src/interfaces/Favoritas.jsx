import React, { useEffect, useState } from "react";
import UniversityCard from "./UniversityCard.jsx";

const Favoritas = ({ idUsuario }) => {
  const [favoritas, setFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritas = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/universidades/favoritas/${idUsuario}`);
        if (!res.ok) throw new Error("Error al obtener favoritas");
        const data = await res.json();
        setFavoritas(data);
      } catch (error) {
        console.error("❌ Error al cargar favoritas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (idUsuario) fetchFavoritas();
  }, [idUsuario]);

  if (loading) return <p className="text-center mt-4">Cargando universidades favoritas...</p>;
  if (favoritas.length === 0)
    return <p className="text-center mt-4 text-gray-500">No has dado like a ninguna universidad aún.</p>;

  return (
    <div className="favoritas-section mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Universidades Favoritas ❤️</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favoritas.map((uni) => (
          <UniversityCard key={uni.id} university={uni} />
        ))}
      </div>
    </div>
  );
};

export default Favoritas;
