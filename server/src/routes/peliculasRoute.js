import { Router } from "express";
import { getMovies, updateMovie,getMovieById, deleteMovie,getMoviesWithReservations } from "../controllers/peliculaController.js";
const router = Router();

router.get("/peliculas", getMovies);
router.get("/pelicula/:id",getMovieById);
router.put("/peliculas/:id", updateMovie);
router.delete('/pelicula/:id',deleteMovie)
router.get('/peliculas/reservacion',getMoviesWithReservations)
export default router;
