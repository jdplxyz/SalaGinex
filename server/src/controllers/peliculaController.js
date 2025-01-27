import { connectDatabase } from "../database/database.js";

import sql from "mssql";

export const addMovie = async (req, res) => {
  const { title, gender, broadcastDate, broadcastHour, sinopsis } = req.body;
  const posterImg = req.file.buffer;

  try {
    const pool = await connectDatabase();
    const result = await pool
      .request()
      .input("titulo", sql.VarChar, title)
      .input("genero", sql.VarChar, gender)
      .input("fecha_transmision", sql.Date, broadcastDate)
      .input("hora_transmision", sql.VarChar, broadcastHour)
      .input("poster", sql.VarBinary, posterImg)
      .input("sinopsis", sql.Text, sinopsis).query(`
        INSERT INTO Administrador.Peliculas (titulo, genero, fecha_transmision, hora_transmision, poster, sinopsis)
        OUTPUT INSERTED.id_pelicula
        VALUES (@titulo, @genero, @fecha_transmision, @hora_transmision, @poster, @sinopsis)
      `);

    res.status(200).json({ message: "Película agregada exitosamente." });
  } catch (error) {
    res.status(500).json({
      error: "Error al ingresar la película.",
      details: error.message,
    });
  }
};

export const getMovies = async (req, res) => {
  try {
    const pool = await connectDatabase();
    const result = await pool
      .request()
      .query("SELECT * FROM Administrador.Peliculas");

    const movies = result.recordset.map((movie) => {
      if (movie.poster) {
        const base64Image = movie.poster.toString("base64");
        movie.poster = `data:image/jpeg;base64,${base64Image}`;
      }
      return movie;
    });
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
  }
};

export const getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await connectDatabase();
    const result = await pool
      .request()
      .input("id_pelicula", sql.VarChar, id)
      .query(
        "SELECT * FROM Administrador.Peliculas WHERE id_pelicula = @id_pelicula"
      );

    if (result.rowsAffected.length > 0) {
      const movies = result.recordset.map((movie) => {
        if (movie.poster) {
          const base64Image = movie.poster.toString("base64");
          movie.poster = `data:image/jpeg;base64,${base64Image}`;
        }
        return movie;
      });
      return res.json({ data: movies });
    } else {
      return res
        .status(400)
        .json({ error: "Lo sentimos, pelicula no encontrada." });
    }
  } catch (error) {
    return res.status(400).json({ message: "Pelicula no encontrada." });
  }
};

export const updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, gender, broadcastDate, broadcastHour, sinopsis } = req.body;

  try {
    const pool = await connectDatabase();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("title", sql.VarChar, title)
      .input("gender", sql.VarChar, gender)
      .input("broadcastDate", sql.Date, broadcastDate)
      .input("broadcastHour", sql.VarChar, broadcastHour)
      .input("sinopsis", sql.VarChar, sinopsis).query(`
      UPDATE Administrador.Peliculas
      SET titulo = @title,
          genero = @gender,
          fecha_transmision = @broadcastDate,
          hora_transmision = @broadcastHour,
          sinopsis = @sinopsis
      WHERE id_pelicula = @id
    `);
    res.status(200).json({ message: "Película actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la película" });
  }
};

export const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await connectDatabase();
    const result = await pool
      .request()
      .input("id_pelicula", sql.Int, id)
      .query(
        "DELETE FROM Administrador.Peliculas WHERE id_pelicula = @id_pelicula"
      );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Película no encontrada." });
    } else {
      return res.json({ data: "Pelicula eliminada con exito." });
    }
  } catch (error) {
    return res.status(400).json({ error: "Error al eliminar pelicula." });
  }
};

export const getMoviesWithReservations = async (req, res) => {
  try {
    const pool = await connectDatabase();

    const reservationsResult = await pool
      .request()
      .query(
        "SELECT id_pelicula FROM Administrador.Reservacion WHERE confirmado = 1"
      );

    if (reservationsResult.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron reservaciones confirmadas." });
    }

    const moviesIds = reservationsResult.recordset.map(
      (reservation) => reservation.id_pelicula
    );

    const moviesResult = await pool
      .request()
      .query(
        `SELECT * FROM Administrador.Peliculas WHERE id_pelicula IN (${moviesIds.join(
          ","
        )})`
      );

    if (moviesResult.recordset.length === 0) {
      return res.status(404).json({
        message: "No se encontraron usuarios con reservaciones confirmadas.",
      });
    }
    res.status(200).json({
      message:
        "Peliculas con reservaciones confirmadas obtenidos correctamente.",
      data: moviesResult.recordset,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener las peliculas con reservaciones confirmadas.",
    });
  }
};

// Función para eliminar películas expiradas
export const eliminarPeliculasExpiradas = async () => {
  let pool;
  try {
      pool = await connectDatabase();
      const request = pool.request(); 
      await request.execute('EliminarPeliculasExpiradas'); 
      console.log('Procedimiento almacenado ejecutado correctamente.');
  } catch (error) {
      console.error('Error:', error);
      throw error; 
  } finally {
      if (pool) {
          await pool.close(); 
      }
  }
};