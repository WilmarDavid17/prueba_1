import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL='postgresql://neondb_owner:npg_6SXp3hCUTGPc@ep-fancy-moon-ad802hep-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } catch (error) {
    console.error("[v0] Database error:", error)
    throw error
  } finally {
    client.release()
  }
}
