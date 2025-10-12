import React, { useEffect, useState } from "react";
import "../componentesCss/hilos.css";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const Hilos = () => {
  const [usuario, setUsuario] = useState(null);
  const [hilos, setHilos] = useState([]);
  const [nuevoHilo, setNuevoHilo] = useState("");
  const [respuestas, setRespuestas] = useState({});
  const [cargando, setCargando] = useState(false);
  const [cargandoRespuestas, setCargandoRespuestas] = useState({});

  // 🔹 Cargar usuario desde sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUsuario(userData);
        console.log("✅ Usuario cargado:", userData);
      } catch (error) {
        console.error("❌ Error parseando usuario:", error);
      }
    }
  }, []);

  // 🔹 Cargar todos los hilos
  useEffect(() => {
    obtenerHilos();
  }, []);

  const obtenerHilos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/hilos");
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setHilos(data);
    } catch (error) {
      console.error("❌ Error al obtener hilos:", error);
    }
  };

  // 🔹 Crear un nuevo hilo
  const crearHilo = async (e) => {
    e.preventDefault();
    
    if (!nuevoHilo.trim() || !usuario) return;

    try {
      setCargando(true);
      const res = await fetch("http://localhost:5000/api/hilos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          contenido: nuevoHilo.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error ${res.status}`);
      }

      setNuevoHilo("");
      await obtenerHilos();
      
    } catch (error) {
      console.error("❌ Error al crear hilo:", error);
      alert("Error al crear hilo: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  // 🔹 Crear respuesta a un hilo
  const enviarRespuesta = async (id_hilo) => {
    const contenido = respuestas[id_hilo];
    
    if (!contenido?.trim() || !usuario) return;

    try {
      setCargandoRespuestas(prev => ({ ...prev, [id_hilo]: true }));

      const res = await fetch(
        `http://localhost:5000/api/hilos/${id_hilo}/respuesta`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: usuario.id_usuario,
            contenido: contenido.trim(),
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.detalles || `Error ${res.status}`);
      }

      // Limpiar el textarea y actualizar hilos
      setRespuestas({ ...respuestas, [id_hilo]: "" });
      await obtenerHilos();
      
    } catch (error) {
      console.error("❌ Error al crear respuesta:", error);
      alert(`Error al enviar respuesta: ${error.message}`);
    } finally {
      setCargandoRespuestas(prev => ({ ...prev, [id_hilo]: false }));
    }
  };

  // 🔹 Manejar tecla Enter para enviar respuesta
  const manejarKeyPress = (e, id_hilo) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarRespuesta(id_hilo);
    }
  };

  return (
    <>
      <Header />
      <div className="hilos-container">
        <h2 className="titulo-hilos">Hilos de la comunidad 💬</h2>

        {/* Crear nuevo hilo */}
        <form className="nuevo-hilo" onSubmit={crearHilo}>
          <textarea
            value={nuevoHilo}
            onChange={(e) => setNuevoHilo(e.target.value)}
            placeholder="¿Qué estás pensando?"
            rows={3}
            disabled={!usuario}
          />
          <button 
            type="submit" 
            disabled={cargando || !usuario || !nuevoHilo.trim()}
          >
            {cargando ? "Publicando..." : "Publicar"}
          </button>
          {!usuario && (
            <p className="mensaje-advertencia">Inicia sesión para publicar</p>
          )}
        </form>

        {/* Lista de hilos */}
        <div className="lista-hilos">
          {hilos.length === 0 ? (
            <p className="no-hilos">Aún no hay hilos publicados 😔</p>
          ) : (
            hilos.map((hilo) => (
              <div key={hilo.id_hilo} className="hilo-card">
                <div className="hilo-header">
                  <strong>{hilo.nombre_usuario}</strong>{" "}
                  <span className="fecha">
                    {new Date(hilo.fecha_creacion).toLocaleString()}
                  </span>
                </div>

                <p className="hilo-contenido">{hilo.contenido}</p>

                {/* Respuestas */}
                <div className="respuestas">
                  {hilo.respuestas?.length > 0 ? (
                    hilo.respuestas.map((r) => (
                      <div key={r.id_respuesta} className="respuesta">
                        <div className="respuesta-header">
                          <strong>{r.nombre_usuario}</strong>{" "}
                          <span className="fecha">
                            {new Date(r.fecha_creacion).toLocaleString()}
                          </span>
                        </div>
                        <p>{r.contenido}</p>
                      </div>
                    ))
                  ) : (
                    <p className="sin-respuestas">Aún no hay respuestas</p>
                  )}
                </div>

                {/* Formulario para responder */}
                <div className="responder">
                  <textarea
                    value={respuestas[hilo.id_hilo] || ""}
                    onChange={(e) =>
                      setRespuestas({
                        ...respuestas,
                        [hilo.id_hilo]: e.target.value,
                      })
                    }
                    onKeyPress={(e) => manejarKeyPress(e, hilo.id_hilo)}
                    placeholder={usuario ? "Escribe una respuesta..." : "Inicia sesión para responder"}
                    rows={2}
                    disabled={!usuario}
                  />
                  <button
                    onClick={() => enviarRespuesta(hilo.id_hilo)}
                    disabled={!usuario || !respuestas[hilo.id_hilo]?.trim() || cargandoRespuestas[hilo.id_hilo]}
                  >
                    {cargandoRespuestas[hilo.id_hilo] ? "Enviando..." : "Responder"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Hilos;