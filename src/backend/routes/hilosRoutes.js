import express from "express";
import {
  crearHilo,
  obtenerHilos,
  obtenerHiloPorId,
  crearRespuesta,
} from "../controller/hilosController.js";

const router = express.Router();

router.post("/", crearHilo); // Crear hilo
router.get("/", obtenerHilos); // Obtener todos los hilos
router.get("/:id", obtenerHiloPorId); // Obtener hilo por ID
router.post("/:id_hilo/respuesta", crearRespuesta);


export default router;