import sql from "mssql";
import { config } from "dotenv";
config({ path: "../.env" });

const {
  DB_USER: user,
  DB_PASSWORD: password,
  DB_SERVER: server,
  DB_NAME: database,
} = process.env;

const sqlConfig = {
  user: user,
  password: password,
  database: database,
  server: server,
  port:1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const connectDatabase = async () => {
  try {
    const pool = await sql.connect(sqlConfig);
    return pool;
  } catch (error) {
    console.error(error.message);
  }
};
