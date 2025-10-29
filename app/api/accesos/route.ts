// app/api/accesos/route.ts
import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export const dynamic = "force-dynamic"

// ✅ GET - Obtener los últimos 100 accesos
export async function GET() {
  try {
    console.log("[v0] GET /api/accesos called")

    const result = await query(
      `SELECT id, rfid, nombre_profesor, salon, hora_apertura, hora_cierre, estado 
       FROM accesos 
       ORDER BY hora_apertura DESC 
       LIMIT 100`
    )

    const accesos = (result as any).rows || result
    console.log("[v0] GET /api/accesos result length:", accesos.length)

    return NextResponse.json({ success: true, data: accesos })
  } catch (error: any) {
    console.error("[v0] GET /api/accesos Database error:", error.message, error.code)
    return NextResponse.json({ success: false, error: "Error al obtener los accesos" }, { status: 500 })
  }
}

// ✅ POST - Crear nuevo acceso (abrir salón)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] POST /api/accesos body:", body)
    const { rfid, nombre_profesor, salon } = body

    if (!rfid || !nombre_profesor || !salon) {
      return NextResponse.json({ success: false, error: "Faltan datos requeridos" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO accesos (rfid, nombre_profesor, salon, hora_apertura, estado)
       VALUES ($1, $2, $3, NOW(), 'ABIERTO')
       RETURNING *`,
      [rfid, nombre_profesor, salon]
    )

    const inserted = (result as any).rows?.[0] || null
    console.log("[v0] POST /api/accesos inserted:", inserted)

    return NextResponse.json({
      success: true,
      message: "Acceso registrado correctamente",
      data: inserted,
    })
  } catch (error: any) {
    console.error("[v0] POST /api/accesos Database error:", error.message, error.code)
    return NextResponse.json({ success: false, error: "Error al registrar el acceso" }, { status: 500 })
  }
}
