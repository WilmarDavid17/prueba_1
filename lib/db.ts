import { neon, neonConfig } from "@neondatabase/serverless";

neonConfig.fetchConnectionCache = true;

// Crear cliente a partir de la URL del .env
const sql = neon(process.env.DATABASE_URL!);

/**
 * Ejecuta consultas SQL con o sin parámetros.
 * Usa sql.unsafe() para aceptar strings dinámicos.
 */
export async function query<T = any>(queryText: string, params?: any[]): Promise<T> {
  try {
    let result;

    if (params && params.length > 0) {
      // Usa sql.unsafe(queryText, params) correctamente
      const unsafe = (sql as any).unsafe; // forzamos el tipo para compatibilidad
      result = await unsafe(queryText, params);
    } else {
      const unsafe = (sql as any).unsafe;
      result = await unsafe(queryText);
    }

    return result as T;
  } catch (error) {
    console.error("[Neon] Error ejecutando query:", error);
    throw error;
  }
}
