import express from "express";
import usuariosRoute from "./routes/usuariosRoute.js";
import peliculasRoute from "./routes/peliculasRoute.js";
import reservacionRoute from "./routes/reservacionRoute.js";
import { addMovie } from "./controllers/peliculaController.js";
import { addReservation } from "./controllers/reservacionController.js";
import cors from "cors";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const upload = multer();
export const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(
  cors({
    origin: ["http://localhost:5173", "https://sala-ginex-blwfh86yw-jdplxyzs-projects.vercel.app"],
    credentials: true,
  })
);

const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../client/dist")));

app.use(usuariosRoute);
app.use(peliculasRoute);
app.use(reservacionRoute);

app.post("/peliculas", upload.single("posterImg"), addMovie);
app.post("/reservacion", addReservation);
