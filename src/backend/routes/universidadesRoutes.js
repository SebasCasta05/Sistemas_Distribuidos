// routes/universidadesRoutes.js - Versión corregida
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Obtener todas las universidades con sus datos
router.get("/", async (req, res) => {
  try {
    console.log("Intentando conectar a la base de datos...");
    
    // Consulta simplificada sin joins complejos primero
    const query = `
      SELECT 
        u.iduniversidad,
        u.nombreuniversidad,
        u.imagen_url,
        u.descripcion,
        u.enlace_oficial,
        c.nombreciudad as city,
        tu.tipo as tipo_universidad,
        u.reconocimientoministerio
      FROM universidad u
      LEFT JOIN ciudad c ON u.codigomunicipio = c.codigomunicipio
      LEFT JOIN tipo_universidad tu ON u.id_tipo = tu.id_tipo
      ORDER BY u.nombreuniversidad
    `;

    const result = await pool.query(query);
    console.log(`Se encontraron ${result.rows.length} registros`);
    
    // Ahora obtener las carreras por separado para cada universidad
    const universidadesConCarreras = await Promise.all(
      result.rows.map(async (uni) => {
        try {
          const carrerasQuery = `
            SELECT DISTINCT car.nombrecarrera 
            FROM sede s 
            JOIN carrera car ON s.idsede = car.idsede 
            WHERE s.iduniversidad = $1 AND car.estadoprograma = 'Activo'
          `;
          const carrerasResult = await pool.query(carrerasQuery, [uni.iduniversidad]);
          
          return {
            id: uni.iduniversidad,
            name: uni.nombreuniversidad,
            city: uni.city,
            tipo: uni.tipo_universidad,
            reconocimiento: uni.reconocimientoministerio,
            careers: carrerasResult.rows.map(row => row.nombrecarrera),
            // Usar imagen de la BD o una por defecto
            image: uni.imagen_url || `https://via.placeholder.com/400x200/4A90E2/white?text=${encodeURIComponent(uni.nombreuniversidad.substring(0, 12))}`,
            // Usar la descripción de la BD o una por defecto
            description: uni.descripcion || `${uni.nombreuniversidad} - Universidad ${uni.tipo_universidad?.toLowerCase() || 'privada'} ubicada en ${uni.city}`,
            enlace_oficial: uni.enlace_oficial || '#',
            tuition: uni.tipo_universidad === 'Pública' ? 'Pública' : `$${Math.floor(Math.random() * 10) + 5}M - $${Math.floor(Math.random() * 10) + 10}M`,
            rating: (4 + Math.random() * 0.8).toFixed(1),
            reviews: Math.floor(Math.random() * 2000) + 500,
            accreditation: uni.reconocimientoministerio ? "Acreditación de Alta Calidad" : "Reconocida por el Ministerio",
            ranking: Math.floor(Math.random() * 50) + 1
          };
        } catch (error) {
          console.error(`Error obteniendo carreras para universidad ${uni.iduniversidad}:`, error);
          return {
            ...uni,
            careers: [],
            image: `https://via.placeholder.com/400x200/4A90E2/white?text=${encodeURIComponent(uni.nombreuniversidad.substring(0, 12))}`,
            tuition: uni.tipo_universidad === 'Pública' ? 'Pública' : `$${Math.floor(Math.random() * 10) + 5}M - $${Math.floor(Math.random() * 10) + 10}M`,
            rating: (4 + Math.random() * 0.8).toFixed(1),
            reviews: Math.floor(Math.random() * 2000) + 500,
            accreditation: uni.reconocimientoministerio ? "Acreditación de Alta Calidad" : "Reconocida por el Ministerio",
            ranking: Math.floor(Math.random() * 50) + 1
          };
        }
      })
    );

    console.log(`Se procesaron ${universidadesConCarreras.length} universidades`);
    
    res.json(universidadesConCarreras);
    
  } catch (error) {
    console.error("Error fetching universities:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      message: error.message 
    });
  }
});

// Obtener ciudades disponibles
router.get("/ciudades", async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT c.nombreciudad 
      FROM ciudad c
      JOIN universidad u ON c.codigomunicipio = u.codigomunicipio
      ORDER BY c.nombreciudad
    `;
    
    const result = await pool.query(query);
    const ciudades = result.rows.map(row => row.nombreciudad);
    res.json(ciudades);
    
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener carreras disponibles
router.get("/carreras", async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT nombrecarrera 
      FROM carrera 
      WHERE estadoprograma = 'Activo'
      ORDER BY nombrecarrera
    `;
    
    const result = await pool.query(query);
    const carreras = result.rows.map(row => row.nombrecarrera);
    res.json(carreras);
    
  } catch (error) {
    console.error("Error fetching careers:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;