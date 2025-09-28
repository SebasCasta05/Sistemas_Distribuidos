import pool from "../config/db.js";
import bcrypt from "bcrypt";

// =====================
// Registrar usuario
// =====================
export const registerUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password, direccion, telefono, tipo_usuario } = req.body;

    if (!nombre || !apellido || !email || !password || !tipo_usuario) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Verificar si el correo ya existe
    const userExists = await pool.query("SELECT * FROM usuario WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insertar usuario en BD
    const newUser = await pool.query(
      `INSERT INTO usuario (nombre, apellido, email, password_hash, direccion, telefono, tipo_usuario) 
       VALUES ($1,$2,$3,$4,$5,$6,$7) 
       RETURNING id_usuario, nombre, apellido, email, direccion, telefono, tipo_usuario, fecha_creacion`,
      [nombre, apellido, email, passwordHash, direccion || null, telefono || null, tipo_usuario || "estudiante"]
    );

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error("❌ Error en registerUser:", err);
    res.status(500).json({ message: "Error en el servidor", detalle: err.message });
  }
};

// =====================
// Login usuario
// =====================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM usuario WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    res.json({
      message: "Login exitoso",
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        direccion: user.direccion,
        telefono: user.telefono,
        tipo_usuario: user.tipo_usuario,
      }
    });
  } catch (err) {
    console.error("❌ Error en loginUser:", err);
    res.status(500).json({ message: "Error en el servidor", error: err.message });
  }
};

// =====================
// Obtener usuario por ID
// =====================
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const result = await pool.query(
      `SELECT id_usuario, nombre, apellido, email, direccion, telefono, tipo_usuario, fecha_creacion 
       FROM usuario WHERE id_usuario = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error en getUserById:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// =====================
// Actualizar usuario
// =====================
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, direccion, telefono, tipo_usuario } = req.body;

    const result = await pool.query(
      `UPDATE usuario 
       SET nombre = $1, apellido = $2, email = $3, direccion = $4, telefono = $5, tipo_usuario = $6
       WHERE id_usuario = $7
       RETURNING id_usuario, nombre, apellido, email, direccion, telefono, tipo_usuario, fecha_creacion`,
      [nombre, apellido, email, direccion, telefono, tipo_usuario, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 👇 En vez de devolver {message, user: ...}
    res.json(result.rows[0]);

  } catch (err) {
    console.error("❌ Error en updateUser:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
// =====================
// Eliminar usuario
// =====================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM usuario WHERE id_usuario=$1 RETURNING id_usuario", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error en deleteUser:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
