import { Router } from "express";
import { addReservation, getSeatReservated, getOrderReservated,updateOrdenReservated,getOrdenConfirmated } from "../controllers/reservacionController.js";
const router = Router();


router.post('/reservacion',addReservation)
router.get('/asientos/:id',getSeatReservated)
router.post('/orden',getOrderReservated)
router.put('/orden',updateOrdenReservated)
router.get('/orden',getOrdenConfirmated)
router.get('/export',getHistorialToExport)

export default router