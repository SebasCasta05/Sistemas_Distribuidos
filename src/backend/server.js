import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import publicacionesRoutes from "./routes/publicacionesRouters.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/publicaciones", publicacionesRoutes);

// Servidor
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));