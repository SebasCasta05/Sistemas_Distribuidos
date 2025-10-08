import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUserById, 
  updateUser, 
  deleteUser,
  updateUserImage
} from "../controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

router.put("/:id/imagen", updateUserImage);

export default router;
