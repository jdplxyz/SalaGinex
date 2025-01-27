import { Router } from "express";
import { addReservation, getSeatReservated, getOrderReservated,updateOrdenReservated,getOrdenConfirmated,getHistorialToExport } from "../controllers/reservacionController.js";
import { verify } from "crypto";
import { verifyToken } from "../controllers/usuarioController.js";
const router = Router();


router.post('/reservacion',verifyToken,addReservation)
router.get('/asientos/:id',verifyToken,getSeatReservated)
router.post('/orden',verifyToken,getOrderReservated)
router.put('/orden',verifyToken,updateOrdenReservated)
router.get('/orden',verifyToken,getOrdenConfirmated)
router.get('/export',verifyToken,getHistorialToExport)

export default router