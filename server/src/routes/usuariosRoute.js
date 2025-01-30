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
  sendMail,
  resetPassword,
  verifyUser
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

router.get("/users", verifyToken,getAllUsers);
router.post("/usersByEmail", verifyToken,getUserByEmail);
router.delete("/users/:id", verifyToken,deleteUserById);
router.put("/users/:id", verifyToken,updateUserById);
router.get("/users/reservacion", verifyToken,getUsersWithReservations);
router.post("/recuperar",sendMail);
router.put("/reset", resetPassword);
router.put("/verify",verifyUser)


export default router;
