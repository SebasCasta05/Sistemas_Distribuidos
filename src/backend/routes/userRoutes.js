import express from "express";
import { registerUser, loginUser, getUserById } from "../controller/userController.js";

const router = express.Router();

// Registro
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Obtener usuario por id
router.get("/:id", getUserById);

export default router;
