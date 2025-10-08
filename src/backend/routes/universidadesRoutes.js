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

router.get("/", getUniversidades);

router.get("/ciudades", getCiudades);

router.get("/carreras", getCarreras);

router.get("/buscar", buscarUniversidades);

router.get("/:id", getUniversidadById);

router.get("/favoritas/:id_usuario", getFavoritas);

router.post("/like/check", checkIfLiked);

router.post("/like/toggle", toggleLike);

export default router;