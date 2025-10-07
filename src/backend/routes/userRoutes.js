import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUserById, 
  updateUser, 
  deleteUser,
  updateUserImage // 👈 nueva función que debes agregar en tu userController.js
} from "../controller/userController.js";

const router = express.Router();

// Registro
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Obtener usuario por id
router.get("/:id", getUserById);

// Actualizar usuario
router.put("/:id", updateUser);

// Eliminar usuario
router.delete("/:id", deleteUser);

// ✅ NUEVA RUTA: Actualizar solo la imagen de perfil
router.put("/:id/imagen", updateUserImage);

export default router;
