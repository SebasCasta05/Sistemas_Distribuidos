import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import pkg from "pg";
import jwt from "jsonwebtoken";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "prueba",
  password: "123", // 👈 cambia a tu contraseña real
  port: 5432,
});

// 🔹 Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Token requerido" });

  jwt.verify(token.split(" ")[1], "mi_secreto_super_seguro", (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido" });
    req.user = decoded;
    next();
  });
};

// 🔹 Registro de usuario
app.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const userExist = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      "INSERT INTO users (nombre, email, password, tipo_usuario) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, email, hashedPassword, "cliente"]
    );

    res.status(201).json({ message: "Usuario registrado con éxito ✅", user: newUser.rows[0] });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// 🔹 Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const foundUser = user.rows[0];

    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: foundUser.id, email: foundUser.email, tipo_usuario: foundUser.tipo_usuario },
      "mi_secreto_super_seguro",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso ✅", token });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 🔹 Perfil protegido
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await db.query(
      "SELECT id, nombre, email, tipo_usuario FROM users WHERE id = $1",
      [req.user.id]
    );
    res.json(user.rows[0]);
  } catch (error) {
    console.error("Error en profile:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/publicaciones", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, u.nombre AS nombre_usuario
       FROM publicaciones p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.fecha DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error obteniendo publicaciones:", err);
    res.status(500).json({ error: "Error al obtener publicaciones" });
  }
});

// Crear publicación
app.post("/publicaciones", async (req, res) => {
  const { titulo, descripcion, categoria } = req.body;
  const userId = 1; // 🔧 Simulación (luego usarás JWT para el user real)

  try {
    const result = await db.query(
      "INSERT INTO publicaciones (user_id, titulo, descripcion, categoria) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, titulo, descripcion, categoria]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creando publicación:", err);
    res.status(500).json({ error: "Error al crear publicación" });
  }
});


// Iniciar servidor
app.listen(4000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:4000");
});
