import pool from "../config/db.js";
import bcrypt from "bcrypt";

// Registrar usuario
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
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id_usuario, nombre, apellido, email, direccion, telefono, tipo_usuario, fecha_creacion`,
      [nombre, apellido, email, passwordHash, direccion || null, telefono || null, tipo_usuario || "estudiante"]
    );

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error("Error en registerUser:", err);
    res.status(500).json({ message: "Error en el servidorrr", detalle: err.message,       // 👈 muestra el mensaje exacto
    stack: err.stack   });
  }
};

// Login usuario
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const result = await pool.query("SELECT * FROM usuario WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // Verificar contraseña
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
    console.error("Error en loginUser:", err);
    res.status(500).json({ message: "Error en el servidor", error: err.message });
  }
};
