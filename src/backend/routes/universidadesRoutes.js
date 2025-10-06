import express from "express";
import pool from "../config/db.js"; // Asegúrate de tener tu configuración de base de datos

const router = express.Router();

// Obtener todas las universidades con sus datos
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        u.iduniversidad,
        u.nombreuniversidad,
        c.nombreciudad as city,
        tu.tipo as tipo_universidad,
        u.reconocimientoministerio,
        r.rankingnacional as ranking,
        s.idsede,
        s.nombresede,
        car.idcarrera,
        car.nombrecarrera,
        car.numerosemestres,
        car.preciocredito,
        car.registrocalificado,
        car.estadoprograma,
        d.nombredepartamento
      FROM universidad u
      LEFT JOIN ciudad c ON u.codigomunicipio = c.codigomunicipio
      LEFT JOIN departamento d ON c.codigodepartamento = d.codigodepartamento
      LEFT JOIN tipo_universidad tu ON u.id_tipo = tu.id_tipo
      LEFT JOIN ranking r ON u.iduniversidad = r.iduniversidad
      LEFT JOIN sede s ON u.iduniversidad = s.iduniversidad
      LEFT JOIN carrera car ON s.idsede = car.idsede
      WHERE car.estadoprograma = 'Activo'
      ORDER BY u.nombreuniversidad, car.nombrecarrera
    `;

    const result = await pool.query(query);
    
    // Procesar los resultados para agrupar por universidad
    const universidadesMap = new Map();
    
    result.rows.forEach(row => {
      if (!universidadesMap.has(row.iduniversidad)) {
        universidadesMap.set(row.iduniversidad, {
          id: row.iduniversidad,
          name: row.nombreuniversidad,
          city: row.city,
          departamento: row.nombredepartamento,
          tipo: row.tipo_universidad,
          reconocimiento: row.reconocimientoministerio,
          ranking: row.ranking,
          sedes: [],
          careers: [],
          tuition: row.tipo_universidad === 'Pública' ? 'Pública' : `$${Math.floor(Math.random() * 10) + 5}M - $${Math.floor(Math.random() * 10) + 10}M`,
          image: `https://via.placeholder.com/400x200/${Math.floor(Math.random()*16777215).toString(16)}/white?text=${encodeURIComponent(row.nombreuniversidad.substring(0, 10))}`,
          rating: (4 + Math.random() * 0.8).toFixed(1),
          reviews: Math.floor(Math.random() * 2000) + 500,
          description: `${row.nombreuniversidad} - Universidad ${row.tipo_universidad.toLowerCase()} ubicada en ${row.city}`,
          accreditation: row.reconocimientoministerio ? "Acreditación de Alta Calidad" : "Reconocida por el Ministerio"
        });
      }
      
      const universidad = universidadesMap.get(row.iduniversidad);
      
      // Agregar carrera si existe y no está duplicada
      if (row.nombrecarrera && !universidad.careers.includes(row.nombrecarrera)) {
        universidad.careers.push(row.nombrecarrera);
      }
      
      // Agregar sede si existe y no está duplicada
      if (row.nombresede && !universidad.sedes.some(s => s.id === row.idsede)) {
        universidad.sedes.push({
          id: row.idsede,
          nombre: row.nombresede,
          ciudad: row.city
        });
      }
    });
    
    const universidades = Array.from(universidadesMap.values());
    res.json(universidades);
    
  } catch (error) {
    console.error("Error fetching universities:", error);
    res.status(500).json({ error: "Error interno del servidor" });
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