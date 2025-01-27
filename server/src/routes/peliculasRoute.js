import { Router } from "express";
import { getMovies, updateMovie,getMovieById, deleteMovie,getMoviesWithReservations } from "../controllers/peliculaController.js";
import { verifyToken } from "../controllers/usuarioController.js";
const router = Router();

router.get("/peliculas", verifyToken,getMovies);
router.get("/pelicula/:id",verifyToken,getMovieById);
router.put("/peliculas/:id", verifyToken,updateMovie);
router.delete('/pelicula/:id',verifyToken,deleteMovie)
router.get('/peliculas/reservacion',verifyToken,getMoviesWithReservations)
export default router;
