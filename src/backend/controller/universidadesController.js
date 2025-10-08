import pool from "../config/db.js";

export const getUniversidades = async (req, res) => {
  try {
    const { id_usuario } = req.query;

    let query = `
      SELECT 
        u.iduniversidad AS id,
        u.nombreuniversidad AS nombre,
        u.descripcion,
        u.imagen_url AS imagen,
        u.enlace_oficial AS link,
        c.nombreciudad AS ciudad,
        -- Campos adicionales para las tarjetas
        (
          SELECT STRING_AGG(DISTINCT ca.nombrecarrera, ', ')
          FROM carrera ca
          JOIN sede s ON s.idsede = ca.idsede
          WHERE s.iduniversidad = u.iduniversidad
          AND ca.estadoprograma = 'Activo'
          LIMIT 3
        ) AS carreras,
        (
          SELECT AVG(ca.preciocredito) * 160 -- Costo estimado por semestre (16 créditos promedio)
          FROM carrera ca
          JOIN sede s ON s.idsede = ca.idsede
          WHERE s.iduniversidad = u.iduniversidad
          AND ca.preciocredito IS NOT NULL
        ) AS costo,
        CASE 
          WHEN u.reconocimientoministerio = true THEN 'Acreditada'
          ELSE 'En proceso'
        END AS acreditacion,
        COALESCE(u.likes_count, 0) AS likes_count,
        ${id_usuario ? `
        EXISTS(
          SELECT 1 FROM likes l 
          WHERE l.id_usuario = $1 AND l.id_universidad = u.iduniversidad
        ) AS liked
        ` : 'false AS liked'}
      FROM universidad u
      JOIN ciudad c ON c.codigomunicipio = u.codigomunicipio
      ORDER BY u.nombreuniversidad;
    `;

    const params = id_usuario ? [id_usuario] : [];
    const result = await pool.query(query, params);
    
    const universidadesProcesadas = result.rows.map(uni => ({
      ...uni,
      carreras: uni.carreras || 'Carreras no disponibles',
      costo: uni.costo ? Math.round(uni.costo) : null,
      acreditacion: uni.acreditacion || 'No especificada',
      descripcion: uni.descripcion || 'Sin descripción disponible.',
      imagen: uni.imagen || '/placeholder-university.jpg'
    }));
    
    res.json(universidadesProcesadas);
  } catch (error) {
    console.error("❌ Error al obtener universidades:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getCiudades = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT c.nombreciudad
      FROM ciudad c
      JOIN universidad u ON c.codigomunicipio = u.codigomunicipio
      ORDER BY c.nombreciudad;
    `);
    res.json(result.rows.map((row) => row.nombreciudad));
  } catch (error) {
    console.error("❌ Error al obtener ciudades:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getCarreras = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT nombrecarrera
      FROM carrera 
      WHERE estadoprograma = 'Activo'
      ORDER BY nombrecarrera;
    `);
    res.json(result.rows.map((row) => row.nombrecarrera));
  } catch (error) {
    console.error("❌ Error al obtener carreras:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const buscarUniversidades = async (req, res) => {
  try {
    const { ciudad, carrera, acreditacion, id_usuario } = req.query;
    
    let query = `
      SELECT DISTINCT
        u.iduniversidad AS id,
        u.nombreuniversidad AS nombre,
        u.descripcion,
        u.imagen_url AS imagen,
        u.enlace_oficial AS link,
        c.nombreciudad AS ciudad,
        (
          SELECT STRING_AGG(DISTINCT ca.nombrecarrera, ', ')
          FROM carrera ca
          JOIN sede s ON s.idsede = ca.idsede
          WHERE s.iduniversidad = u.iduniversidad
          AND ca.estadoprograma = 'Activo'
          LIMIT 3
        ) AS carreras,
        (
          SELECT AVG(ca.preciocredito) * 160
          FROM carrera ca
          JOIN sede s ON s.idsede = ca.idsede
          WHERE s.iduniversidad = u.iduniversidad
          AND ca.preciocredito IS NOT NULL
        ) AS costo,
        CASE 
          WHEN u.reconocimientoministerio = true THEN 'Acreditada'
          ELSE 'En proceso'
        END AS acreditacion,
        COALESCE(u.likes_count, 0) AS likes_count,
        ${id_usuario ? `
        EXISTS(
          SELECT 1 FROM likes l 
          WHERE l.id_usuario = $1 AND l.id_universidad = u.iduniversidad
        ) AS liked
        ` : 'false AS liked'}
      FROM universidad u
      JOIN ciudad c ON c.codigomunicipio = u.codigomunicipio
      LEFT JOIN sede s ON s.iduniversidad = u.iduniversidad
      LEFT JOIN carrera ca ON ca.idsede = s.idsede
      WHERE 1=1
    `;

    const params = [];
    let paramCount = id_usuario ? 1 : 0;

    if (ciudad) {
      paramCount++;
      query += ` AND c.nombreciudad = $${paramCount}`;
      params.push(ciudad);
    }

    if (carrera) {
      paramCount++;
      query += ` AND ca.nombrecarrera = $${paramCount}`;
      params.push(carrera);
    }

    if (acreditacion === 'Acreditada') {
      query += ` AND u.reconocimientoministerio = true`;
    }

    query += ` ORDER BY u.nombreuniversidad`;

    if (id_usuario) {
      params.unshift(id_usuario);
    }

    const result = await pool.query(query, params);
    
    const universidadesProcesadas = result.rows.map(uni => ({
      ...uni,
      carreras: uni.carreras || 'Carreras no disponibles',
      costo: uni.costo ? Math.round(uni.costo) : null,
      acreditacion: uni.acreditacion || 'No especificada',
      descripcion: uni.descripcion || 'Sin descripción disponible.',
      imagen: uni.imagen || '/placeholder-university.jpg'
    }));
    
    res.json(universidadesProcesadas);
  } catch (error) {
    console.error("❌ Error al buscar universidades:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const checkIfLiked = async (req, res) => {
  const { id_usuario, id_universidad } = req.body;

  if (!id_usuario || !id_universidad) {
    return res.status(400).json({ message: "Faltan datos." });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM likes WHERE id_usuario = $1 AND id_universidad = $2",
      [id_usuario, id_universidad]
    );
    res.json({ liked: result.rows.length > 0 });
  } catch (error) {
    console.error("❌ Error al verificar likes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const toggleLike = async (req, res) => {
  const { id_usuario, id_universidad } = req.body;

  if (!id_usuario || !id_universidad) {
    return res.status(401).json({ message: "No autorizado. Inicia sesión primero." });
  }

  try {
    const userCheck = await pool.query(
      "SELECT id_usuario FROM usuario WHERE id_usuario = $1",
      [id_usuario]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const uniCheck = await pool.query(
      "SELECT iduniversidad FROM universidad WHERE iduniversidad = $1",
      [id_universidad]
    );

    if (uniCheck.rows.length === 0) {
      return res.status(404).json({ message: "Universidad no encontrada." });
    }

    const check = await pool.query(
      "SELECT * FROM likes WHERE id_usuario = $1 AND id_universidad = $2",
      [id_usuario, id_universidad]
    );

    if (check.rows.length > 0) {
      await pool.query(
        "DELETE FROM likes WHERE id_usuario = $1 AND id_universidad = $2",
        [id_usuario, id_universidad]
      );
      
      await pool.query(
        "UPDATE universidad SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1) WHERE iduniversidad = $1",
        [id_universidad]
      );
      
      return res.json({ liked: false, message: "❌ Like eliminado." });
    } else {
      await pool.query(
        "INSERT INTO likes (id_usuario, id_universidad) VALUES ($1, $2)",
        [id_usuario, id_universidad]
      );
      
      await pool.query(
        "UPDATE universidad SET likes_count = COALESCE(likes_count, 0) + 1 WHERE iduniversidad = $1",
        [id_universidad]
      );
      
      return res.json({ liked: true, message: "❤️ Like agregado." });
    }
  } catch (error) {
    console.error("❌ Error al alternar like:", error);
    
    if (error.code === '23505') {
      return res.status(400).json({ message: "Ya has dado like a esta universidad." });
    }
    
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getFavoritas = async (req, res) => {
  const { id_usuario } = req.params;

  if (!id_usuario) {
    return res.status(400).json({ message: "ID de usuario requerido." });
  }

  try {
    const query = `
      SELECT 
        u.iduniversidad AS id,
        u.nombreuniversidad AS nombre,
        u.descripcion,
        u.imagen_url AS imagen,
        u.enlace_oficial AS link,
        c.nombreciudad AS ciudad,
        (
          SELECT STRING_AGG(DISTINCT ca.nombrecarrera, ', ')
          FROM carrera ca
          JOIN sede s ON s.idsede = ca.idsede
          WHERE s.iduniversidad = u.iduniversidad
          AND ca.estadoprograma = 'Activo'
          LIMIT 3
        ) AS carreras,
        (
          SELECT AVG(ca.preciocredito) * 160
          FROM carrera ca
          JOIN sede s ON s.idsede = ca.idsede
          WHERE s.iduniversidad = u.iduniversidad
          AND ca.preciocredito IS NOT NULL
        ) AS costo,
        CASE 
          WHEN u.reconocimientoministerio = true THEN 'Acreditada'
          ELSE 'En proceso'
        END AS acreditacion,
        COALESCE(u.likes_count, 0) AS likes_count,
        true AS liked
      FROM universidad u
      JOIN ciudad c ON c.codigomunicipio = u.codigomunicipio
      JOIN likes l ON l.id_universidad = u.iduniversidad
      WHERE l.id_usuario = $1
      ORDER BY u.nombreuniversidad;
    `;

    const result = await pool.query(query, [id_usuario]);
    
    const universidadesProcesadas = result.rows.map(uni => ({
      ...uni,
      carreras: uni.carreras || 'Carreras no disponibles',
      costo: uni.costo ? Math.round(uni.costo) : null,
      acreditacion: uni.acreditacion || 'No especificada',
      descripcion: uni.descripcion || 'Sin descripción disponible.',
      imagen: uni.imagen || '/placeholder-university.jpg'
    }));
    
    res.json(universidadesProcesadas);
  } catch (error) {
    console.error("❌ Error al obtener favoritas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getUniversidadById = async (req, res) => {
  const { id } = req.params;
  const { id_usuario } = req.query;

  try {
    let query = `
      SELECT 
        u.iduniversidad AS id,
        u.nombreuniversidad AS nombre,
        u.descripcion,
        u.imagen_url AS imagen,
        u.enlace_oficial AS link,
        c.nombreciudad AS ciudad,
        d.nombredepartamento AS departamento,
        tu.tipo AS tipo_universidad,
        u.reconocimientoministerio,
        COALESCE(u.likes_count, 0) AS likes_count,
        ${id_usuario ? `
        EXISTS(
          SELECT 1 FROM likes l 
          WHERE l.id_usuario = $2 AND l.id_universidad = u.iduniversidad
        ) AS liked
        ` : 'false AS liked'},
        -- Información de carreras
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'nombre', ca.nombrecarrera,
              'semestres', ca.numerosemestres,
              'precio_credito', ca.preciocredito,
              'registro', ca.registrocalificado
            )
          )
          FROM carrera ca
          JOIN sede s ON s.idsede = ca.idsede
          WHERE s.iduniversidad = u.iduniversidad
          AND ca.estadoprograma = 'Activo'
        ) AS carreras_detalle,
        -- Sedes
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'nombre', s.nombresede,
              'ciudad', c2.nombreciudad
            )
          )
          FROM sede s
          JOIN ciudad c2 ON c2.codigomunicipio = s.codigomunicipio
          WHERE s.iduniversidad = u.iduniversidad
        ) AS sedes
      FROM universidad u
      JOIN ciudad c ON c.codigomunicipio = u.codigomunicipio
      JOIN departamento d ON d.codigodepartamento = c.codigodepartamento
      JOIN tipo_universidad tu ON tu.id_tipo = u.id_tipo
      WHERE u.iduniversidad = $1
    `;

    const params = [id];
    if (id_usuario) {
      params.push(id_usuario);
    }

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Universidad no encontrada." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener universidad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};