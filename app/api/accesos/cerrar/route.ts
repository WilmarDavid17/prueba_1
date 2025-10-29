import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export const dynamic = "force-dynamic"

// PUT - Cerrar un acceso (cerrar salón)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { salon } = body

    if (!salon) {
      return NextResponse.json({ success: false, error: "Falta el número de salón" }, { status: 400 })
    }

    // ✅ Cerrar el acceso más reciente (el último 'ABIERTO')
    const result = await query(
      `UPDATE accesos
       SET hora_cierre = NOW(), estado = 'CERRADO'
       WHERE id = (
         SELECT id FROM accesos
         WHERE salon = $1 AND estado = 'ABIERTO'
         ORDER BY hora_apertura DESC
         LIMIT 1
       )`,
      [salon],
    )

    return NextResponse.json({
      success: true,
      message: "Salón cerrado correctamente",
      data: result,
    })
  } catch (error) {
    console.error("[v0] Error closing acceso:", error)
    return NextResponse.json({ success: false, error: "Error al cerrar el salón" }, { status: 500 })
  }
}
