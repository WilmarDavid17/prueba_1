import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// POST - Endpoint para recibir datos del Arduino AS608
export async function POST(request: Request) {
  try {
    const { fingerprint_id, id_carnet, nombres, apellidos } = await request.json()

    console.log("[v0] Arduino AS608 data received:", { fingerprint_id, id_carnet, nombres, apellidos })

    if (!fingerprint_id || !id_carnet || !nombres || !apellidos) {
      return NextResponse.json({ error: "Datos incompletos del sensor AS608" }, { status: 400 })
    }

    // Registrar asistencia
    const result = await query(
      `INSERT INTO asistencias (id_carnet, nombres, apellidos, hora_entrada) 
       VALUES (?, ?, ?, NOW())`,
      [id_carnet, nombres, apellidos],
    )

    const newAsistencia = await query(
      `SELECT id, id_carnet, nombres, apellidos, hora_entrada 
       FROM asistencias 
       WHERE id = ?`,
      [(result as any).insertId],
    )

    return NextResponse.json(
      {
        success: true,
        message: "Asistencia registrada correctamente",
        data: newAsistencia[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error processing Arduino data:", error)
    return NextResponse.json({ error: "Error al procesar datos del Arduino" }, { status: 500 })
  }
}
