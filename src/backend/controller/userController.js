import pool from "../config/db.js";
import bcrypt from "bcrypt";

// ============================================================
// 📌 Registrar nuevo usuarios
// ============================================================
export const registerUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password, direccion, telefono, tipo_usuario, imagen_url } = req.body;

    if (!nombre || !email || !password || !tipo_usuario) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Verificar si ya existe el usuario
    const userExists = await pool.query("SELECT * FROM usuario WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insertar nuevo usuario (incluye imagen_url opcional)
    const newUser = await pool.query(
      `INSERT INTO usuario (nombre, apellido, email, password_hash, direccion, telefono, tipo_usuario, imagen_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id_usuario, nombre, apellido, email, direccion, telefono, tipo_usuario, imagen_url, fecha_creacion`,
      [nombre, apellido || null, email, passwordHash, direccion || null, telefono || null, tipo_usuario, imagen_url || null]
    );

    // Obtener descripción del tipo de usuario
    const tipo = await pool.query(
      "SELECT descripcion FROM TipoUsuario WHERE idTipoUsuario = $1",
      [tipo_usuario]
    );

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        ...newUser.rows[0],
        tipo_usuario_descripcion: tipo.rows[0]?.descripcion || "Desconocido"
      }
    });
  } catch (err) {
    console.error("❌ Error en registerUser:", err);
    res.status(500).json({ message: "Error en el servidor", detalle: err.message });
  }
};

// ============================================================
// 📌 Login de usuario
// ============================================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT u.*, t.descripcion AS tipo_usuario_descripcion
       FROM usuario u
       JOIN TipoUsuario t ON u.tipo_usuario = t.idTipoUsuario
       WHERE u.email = $1`,
      [email]
    );

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
        tipo_usuario_descripcion: user.tipo_usuario_descripcion,
        imagen_url: user.imagen_url || null
      }
    });
  } catch (err) {
    console.error("❌ Error en loginUser:", err);
    res.status(500).json({ message: "Error en el servidor", error: err.message });
  }
};

// ============================================================
// 📌 Obtener usuario por ID
// ============================================================
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const result = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.direccion, u.telefono, 
              u.tipo_usuario, t.descripcion AS tipo_usuario_descripcion, 
              u.fecha_creacion, u.imagen_url
       FROM usuario u
       JOIN TipoUsuario t ON u.tipo_usuario = t.idTipoUsuario
       WHERE u.id_usuario = $1`,
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

// ============================================================
// 📌 Actualizar usuario completo
// ============================================================
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, direccion, telefono, tipo_usuario, imagen_url } = req.body;

    const result = await pool.query(
      `UPDATE usuario 
       SET nombre = $1, apellido = $2, email = $3, direccion = $4, telefono = $5, tipo_usuario = $6, imagen_url = $7
       WHERE id_usuario = $8
       RETURNING id_usuario, nombre, apellido, email, direccion, telefono, tipo_usuario, imagen_url, fecha_creacion`,
      [nombre, apellido, email, direccion, telefono, tipo_usuario, imagen_url || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const tipo = await pool.query(
      "SELECT descripcion FROM TipoUsuario WHERE idTipoUsuario = $1",
      [tipo_usuario]
    );

    res.json({
      ...result.rows[0],
      tipo_usuario_descripcion: tipo.rows[0]?.descripcion || "Desconocido"
    });

  } catch (err) {
    console.error("❌ Error en updateUser:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ============================================================
// 📌 Eliminar usuario
// ============================================================
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

// ============================================================
// 📌 Nueva función: Actualizar solo la imagen de perfil
// ============================================================
export const updateUserImage = async (req, res) => {
  const { id } = req.params;
  const { imagen_url } = req.body;

  try {
    const result = await pool.query(
      `UPDATE usuario 
       SET imagen_url = $1 
       WHERE id_usuario = $2 
       RETURNING id_usuario, nombre, apellido, email, imagen_url`,
      [imagen_url || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      message: "✅ Imagen de perfil actualizada correctamente",
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al actualizar la imagen de perfil:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
