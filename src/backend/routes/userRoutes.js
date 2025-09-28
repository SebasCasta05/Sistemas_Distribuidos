import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUserById, 
  updateUser, 
  deleteUser 
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

export default router;
