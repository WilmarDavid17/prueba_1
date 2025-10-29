import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export const dynamic = "force-dynamic"

// GET - Obtener todos los accesos
export async function GET() {
  try {
    const accesos = await query(
      `SELECT id, rfid, nombre_profesor, salon, hora_apertura, hora_cierre, estado 
       FROM accesos 
       ORDER BY hora_apertura DESC 
       LIMIT 100`,
    )

    return NextResponse.json({ success: true, data: accesos })
  } catch (error) {
    console.error("[v0] Error fetching accesos:", error)
    return NextResponse.json({ success: false, error: "Error al obtener los accesos" }, { status: 500 })
  }
}

// POST - Crear nuevo acceso (abrir salón)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rfid, nombre_profesor, salon } = body

    if (!rfid || !nombre_profesor || !salon) {
      return NextResponse.json({ success: false, error: "Faltan datos requeridos" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO accesos (rfid, nombre_profesor, salon, hora_apertura, estado) 
       VALUES (?, ?, ?, NOW(), 'ABIERTO')`,
      [rfid, nombre_profesor, salon],
    )

    return NextResponse.json({
      success: true,
      message: "Acceso registrado correctamente",
      data: result,
    })
  } catch (error) {
    console.error("[v0] Error creating acceso:", error)
    return NextResponse.json({ success: false, error: "Error al registrar el acceso" }, { status: 500 })
  }
}
