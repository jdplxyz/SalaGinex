import express from "express";
import usuariosRoute from "./routes/usuariosRoute.js";
import peliculasRoute from "./routes/peliculasRoute.js";
import reservacionRoute from "./routes/reservacionRoute.js";
import { addMovie } from "./controllers/peliculaController.js";
import { addReservation } from "./controllers/reservacionController.js";
import cors from "cors";
import multer from "multer";

const upload = multer();

export const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://salaginex-1.onrender.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(usuariosRoute);
app.use(peliculasRoute);
app.use(reservacionRoute);

app.post("/peliculas", upload.single("posterImg"), addMovie);
app.post("/reservacion", addReservation);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
