import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET - Obtener todas las asistencias
export async function GET() {
  try {
    const asistencias = await query(
      `SELECT id, id_carnet, nombres, apellidos, hora_entrada 
       FROM asistencias 
       ORDER BY hora_entrada DESC 
       LIMIT 100`,
    )

    return NextResponse.json(asistencias)
  } catch (error) {
    console.error("[v0] Error fetching asistencias:", error)
    return NextResponse.json({ error: "Error al obtener asistencias" }, { status: 500 })
  }
}

// POST - Registrar nueva asistencia
export async function POST(request: Request) {
  try {
    const { id_carnet, nombres, apellidos } = await request.json()

    if (!id_carnet || !nombres || !apellidos) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

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

    return NextResponse.json(newAsistencia[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating asistencia:", error)
    return NextResponse.json({ error: "Error al registrar asistencia" }, { status: 500 })
  }
}
