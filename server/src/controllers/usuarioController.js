import { connectDatabase } from "../database/database.js";
import { userSchema } from "../schemas/ValidationUser.js";
import bcrypt from "bcryptjs";
import sql from "mssql";
import { config } from "dotenv";
config({ path: "./.env" });
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
  const { correo_electronico, clave } = req.body;
  console.log(req.body);
  try {
    const pool = await connectDatabase();
    const result = await pool
      .request()
      .input("correo_electronico", sql.VarChar, correo_electronico)
      .query(
        "SELECT * FROM Administrador.Usuario WHERE correo_electronico = @correo_electronico"
      );

    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }
    const isPasswordValid = await bcrypt.compare(clave, user.clave);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        correo_electronico: user.correo_electronico,
        rol: user.rol,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        correo_electronico: user.correo_electronico,
        rol: user.rol,
      },
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const Register = async (req, res) => {
  const { nombre, apellido, correo_electronico, clave, rol } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(clave, 10);
    const newUser = {
      nombre: nombre,
      apellido: apellido,
      correo_electronico: correo_electronico,
      clave: hashedPassword,
    };

    const validatedUser = userSchema.parse(newUser);
    const userExist = await verifyExistUser(correo_electronico);
    if (userExist.recordset.length > 0) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const pool = await connectDatabase();
    const result = await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("apellido", sql.VarChar, apellido)
      .input("correo_electronico", sql.VarChar, correo_electronico)
      .input("clave", sql.Text, hashedPassword)
      .input("rol", sql.VarChar, rol || "Cliente")
      .query(
        "INSERT INTO Administrador.Usuario(nombre, apellido, correo_electronico, clave, rol) VALUES (@nombre, @apellido, @correo_electronico, @clave, @rol)"
      );

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  const pool = await connectDatabase();
  const data = await pool
    .request()
    .input("rol", sql.VarChar, "Cliente")
    .query("SELECT * FROM Administrador.Usuario WHERE rol = @rol");
  res.json({ data: data.recordset });
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.body;

  // Validar que el email esté presente
  if (!email) {
    return res
      .status(400)
      .json({ error: "El correo electrónico es requerido" });
  }

  let pool;
  try {
    pool = await connectDatabase();
    const request = pool.request();
    request.input("correo_electronico", sql.VarChar, email);

    const result = await request.query(
      "SELECT * FROM Administrador.Usuario WHERE correo_electronico = @correo_electronico"
    );

    if (result.recordset.length > 0) {
      console.log("Usuario encontrado");
      return res.json({ data: result.recordset });
    } else {
      console.log("Usuario no encontrado");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error en la consulta:", error);
    return res.status(500).json({ error: "Error al buscar el usuario" });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await connectDatabase();
    const result = await pool
      .request()
      .input("id_usuario", sql.Int, id)
      .query(
        "DELETE FROM Administrador.Usuario WHERE id_usuario = @id_usuario"
      );
    res.status(200).json({ message: "Cliente elimnado." });
  } catch (error) {
    res.status(401).res.json({ error: "Error al eliminar cliente" });
  }
};
export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, apellido, email } = req.body;

  if (!name || !apellido || !email) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }

  try {
    const pool = await connectDatabase();
    const result = await pool
      .request()
      .input("id_usuario", sql.Int, id)
      .input("nombre", sql.VarChar, name)
      .input("apellido", sql.VarChar, apellido)
      .input("correo_electronico", sql.VarChar, email).query(`
        UPDATE Administrador.Usuario 
        SET nombre = @nombre, apellido = @apellido, correo_electronico = @correo_electronico 
        WHERE id_usuario = @id_usuario
      `);
    if (result.rowsAffected > 0) {
      return res.json({ message: "Cliente actualizado correctamente." });
    } else {
      return res
        .status(404)
        .json({ message: "No se encontró el cliente para actualizar." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al actualizar cliente.", details: error.message });
  }
};

const verifyExistUser = async (correo_electronico) => {
  const pool = await connectDatabase();
  const userExist = await pool
    .request()
    .input("correo_electronico", sql.VarChar, correo_electronico)
    .query(
      "SELECT * FROM Administrador.Usuario WHERE correo_electronico = @correo_electronico"
    );
  return userExist;
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Acceso no autorizado" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

export const getUsersWithReservations = async (req, res) => {
  try {
    const pool = await connectDatabase();

    const reservationsResult = await pool
      .request()
      .query(
        "SELECT id_usuario FROM Administrador.Reservacion WHERE confirmado = 1"
      );

    if (reservationsResult.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron reservaciones confirmadas." });
    }

    const userIds = reservationsResult.recordset.map(
      (reservation) => reservation.id_usuario
    );

    const usersResult = await pool
      .request()
      .query(
        `SELECT * FROM Administrador.Usuario WHERE id_usuario IN (${userIds.join(
          ","
        )})`
      );

    if (usersResult.recordset.length === 0) {
      return res
        .status(404)
        .json({
          message: "No se encontraron usuarios con reservaciones confirmadas.",
        });
    }
    res.status(200).json({
      message:
        "Usuarios con reservaciones confirmadas obtenidos correctamente.",
      data: usersResult.recordset,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al obtener los usuarios con reservaciones confirmadas.",
      }); // Enviar un mensaje de error al cliente
  }
};
