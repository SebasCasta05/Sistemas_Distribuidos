import pool from "../config/db.js";

// ✅ Crear un nuevo hilo
export const crearHilo = async (req, res) => {
  try {
    const { id_usuario, contenido, imagen_url } = req.body;

    console.log("📝 Creando hilo:", { id_usuario, contenido, imagen_url });

    if (!id_usuario || !contenido) {
      return res.status(400).json({ 
        error: "Datos incompletos", 
        detalles: "id_usuario y contenido son requeridos" 
      });
    }

    const result = await pool.query(
      `INSERT INTO hilos (id_usuario, contenido, imagen_url)
       VALUES ($1, $2, $3) RETURNING *`,
      [id_usuario, contenido, imagen_url || null]
    );

    console.log("✅ Hilo creado:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error creando hilo:", error);
    res.status(500).json({ 
      error: "Error creando hilo",
      detalles: error.message 
    });
  }
};

// ✅ Obtener todos los hilos con sus respuestas
export const obtenerHilos = async (req, res) => {
  try {
    console.log("📋 Obteniendo todos los hilos...");
    
    const result = await pool.query(`
      SELECT h.*, u.nombre AS nombre_usuario
      FROM hilos h
      JOIN usuario u ON u.id_usuario = h.id_usuario
      ORDER BY h.fecha_creacion DESC
    `);

    const hilos = result.rows;
    console.log(`✅ Se encontraron ${hilos.length} hilos`);

    // Obtener respuestas asociadas a cada hilo
    for (const hilo of hilos) {
      const respuestas = await pool.query(
        `SELECT r.*, u.nombre AS nombre_usuario
         FROM respuestas_hilo r
         JOIN usuario u ON u.id_usuario = r.id_usuario
         WHERE r.id_hilo = $1
         ORDER BY r.fecha_creacion ASC`,
        [hilo.id_hilo]
      );
      hilo.respuestas = respuestas.rows;
    }

    res.json(hilos);
  } catch (error) {
    console.error("❌ Error obteniendo hilos:", error);
    res.status(500).json({ 
      error: "Error obteniendo hilos",
      detalles: error.message 
    });
  }
};

// ✅ Obtener un hilo por ID con sus respuestas (FUNCIÓN QUE FALTABA)
export const obtenerHiloPorId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Obteniendo hilo ID:", id);

    const hiloResult = await pool.query(
      `SELECT h.*, u.nombre AS nombre_usuario
       FROM hilos h
       JOIN usuario u ON u.id_usuario = h.id_usuario
       WHERE h.id_hilo = $1`,
      [id]
    );

    if (hiloResult.rowCount === 0) {
      console.log("❌ Hilo no encontrado:", id);
      return res.status(404).json({ error: "Hilo no encontrado" });
    }

    const hilo = hiloResult.rows[0];

    const respuestas = await pool.query(
      `SELECT r.*, u.nombre AS nombre_usuario
       FROM respuestas_hilo r
       JOIN usuario u ON u.id_usuario = r.id_usuario
       WHERE r.id_hilo = $1
       ORDER BY r.fecha_creacion ASC`,
      [id]
    );

    hilo.respuestas = respuestas.rows;
    console.log("✅ Hilo obtenido:", hilo);

    res.json(hilo);
  } catch (error) {
    console.error("❌ Error obteniendo hilo:", error);
    res.status(500).json({ 
      error: "Error obteniendo hilo",
      detalles: error.message 
    });
  }
};

// ✅ Crear respuesta a un hilo
export const crearRespuesta = async (req, res) => {
  try {
    const { id_hilo } = req.params;
    const { id_usuario, contenido } = req.body;

    console.log("📝 Creando respuesta - Datos recibidos:", { 
      id_hilo, 
      id_usuario, 
      contenido 
    });

    // Validaciones básicas
    if (!id_usuario || !contenido || !contenido.trim()) {
      return res.status(400).json({ 
        error: "Datos incompletos",
        detalles: "id_usuario y contenido son requeridos" 
      });
    }

    // Verificar que el hilo existe
    const hiloExistente = await pool.query(
      "SELECT id_hilo FROM hilos WHERE id_hilo = $1",
      [id_hilo]
    );

    if (hiloExistente.rowCount === 0) {
      return res.status(404).json({ 
        error: "Hilo no encontrado",
        detalles: `No existe un hilo con ID: ${id_hilo}` 
      });
    }

    // Crear la respuesta
    const result = await pool.query(
      `INSERT INTO respuestas_hilo (id_hilo, id_usuario, contenido)
       VALUES ($1, $2, $3) RETURNING *`,
      [id_hilo, id_usuario, contenido.trim()]
    );

    const respuestaCreada = result.rows[0];
    console.log("✅ Respuesta creada exitosamente:", respuestaCreada);
    
    res.status(201).json(respuestaCreada);
    
  } catch (error) {
    console.error("❌ Error creando respuesta:", error);
    
    res.status(500).json({ 
      error: "Error interno del servidor",
      detalles: error.message 
    });
  }
};