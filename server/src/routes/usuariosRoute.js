import { Router } from "express";
import {
  Login,
  Register,
  verifyToken,
  getAllUsers,
  getUserByEmail,
  deleteUserById,
  updateUserById,
  getUsersWithReservations,
} from "../controllers/usuarioController.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Bienvenido a mi API" });
});

router.post("/login", Login);
router.post("/register", Register);
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Acceso permitido", user: req.user });
});

router.get("/users", getAllUsers);
router.post("/usersByEmail", getUserByEmail);
router.delete("/users/:id", deleteUserById);
router.put("/users/:id", updateUserById);
router.get("/users/reservacion", getUsersWithReservations);

export default router;
