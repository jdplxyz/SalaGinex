import express from "express";
import usuariosRoute from "./routes/usuariosRoute.js";
import peliculasRoute from "./routes/peliculasRoute.js";
import reservacionRoute from "./routes/reservacionRoute.js";
import { addMovie } from "./controllers/peliculaController.js";
import { addReservation } from "./controllers/reservacionController.js";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url"; // Importa fileURLToPath para manejar import.meta.url

const upload = multer();

export const app = express();

// Obtén __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://salaginex-1.onrender.com"],
    credentials: true,
  })
);

// Middleware para parsear JSON y URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirve los archivos estáticos de la carpeta dist de Vite
app.use(express.static(path.join(__dirname, "dist")));

// Rutas de la API
app.use(usuariosRoute);
app.use(peliculasRoute);
app.use(reservacionRoute);

// Rutas específicas
app.post("/peliculas", upload.single("posterImg"), addMovie);
app.post("/reservacion", addReservation);

// Maneja todas las demás rutas y sirve el archivo index.html
app.get("*", (req, res) => {
  console.log("Serving index.html for route:", req.path); // Depuración
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
