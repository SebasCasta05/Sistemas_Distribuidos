import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUserById, 
  updateUser, 
  deleteUser,
  updateUserImage,
  seguirUsuario,
  dejarSeguirUsuario,
  verificarSeguimiento,
  obtenerSeguidores,
  obtenerSeguidos,
  obtenerEstadisticasSeguidores
} from "../controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/imagen", updateUserImage);

// Nuevas rutas para seguidores
router.post("/seguir", seguirUsuario);
router.post("/dejar-seguir", dejarSeguirUsuario);
router.get("/seguimiento/:id_seguidor/:id_seguido", verificarSeguimiento);
router.get("/:id_usuario/seguidores", obtenerSeguidores);
router.get("/:id_usuario/seguidos", obtenerSeguidos);
router.get("/:id_usuario/estadisticas-seguidores", obtenerEstadisticasSeguidores);

export default router;