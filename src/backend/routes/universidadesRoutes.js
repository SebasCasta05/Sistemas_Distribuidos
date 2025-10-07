import express from "express";
import {
  getUniversidades,
  getCiudades,
  getCarreras,
  buscarUniversidades,
  toggleLike,
  checkIfLiked,
  getFavoritas,
  getUniversidadById
} from "../controller/universidadesController.js";

const router = express.Router();

// 🔹 Obtener todas las universidades
router.get("/", getUniversidades);

// 🔹 Obtener lista de ciudades
router.get("/ciudades", getCiudades);

// 🔹 Obtener lista de carreras
router.get("/carreras", getCarreras);

// 🔹 Buscar universidades con filtros
router.get("/buscar", buscarUniversidades);

// 🔹 Obtener universidad por ID
router.get("/:id", getUniversidadById);

// 🔹 Obtener favoritas de usuario
router.get("/favoritas/:id_usuario", getFavoritas);

// 🔹 Verificar si ya le dio like
router.post("/like/check", checkIfLiked);

// 🔹 Alternar like
router.post("/like/toggle", toggleLike);

export default router;