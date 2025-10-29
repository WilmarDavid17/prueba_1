import mysql from "mysql2/promise";

const isProduction = process.env.NODE_ENV === "production";

// Configuración de conexión (usa variables de entorno en producción)
const dbConfig = {
  host: process.env.DB_HOST || (isProduction ? "" : "localhost"),
  user: process.env.DB_USER || (isProduction ? "" : "root"),
  password: process.env.DB_PASSWORD || (isProduction ? "" : "misionTic2022"),
  database: process.env.DB_NAME || "control_acceso_salones",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  ssl: isProduction
    ? {
        rejectUnauthorized: true, // Requerido para PlanetScale / MySQL Cloud
      }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Pool global para evitar múltiples conexiones
let pool: mysql.Pool | null = null;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    console.log("[DB] Pool de conexión inicializado");
  }
  return pool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results as T;
  } catch (err) {
    console.error("[DB Error]", err);
    throw err;
  } finally {
    connection.release();
  }
}
