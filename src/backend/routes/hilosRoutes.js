import express from "express";
import {
  crearHilo,
  obtenerHilos,
  obtenerHiloPorId,
  crearRespuesta,
  obtenerHilosUsuario,  // ✅ Agregar esta importación
  eliminarHilo          // ✅ Agregar esta importación
} from "../controller/hilosController.js";

const router = express.Router();

router.post("/", crearHilo); // Crear hilo
router.get("/", obtenerHilos); // Obtener todos los hilos
router.get("/:id", obtenerHiloPorId); // Obtener hilo por ID
router.post("/:id_hilo/respuesta", crearRespuesta); // Crear respuesta
router.get("/usuario/:id_usuario", obtenerHilosUsuario); // Obtener hilos de usuario
router.delete("/:id", eliminarHilo); // Eliminar hilo

export default router;