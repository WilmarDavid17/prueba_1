// app/api/accesos/cerrar/route.ts
import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export const dynamic = "force-dynamic"

// PUT - Cerrar un acceso (cerrar salón)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { salon } = body
    console.log("[v0] PUT /api/accesos/cerrar body:", body)

    if (!salon) {
      return NextResponse.json(
        { success: false, error: "Falta el número de salón" },
        { status: 400 }
      )
    }

    // ✅ Cerrar el último acceso 'ABIERTO' de ese salón
    const result = await query(
      `UPDATE accesos
       SET hora_cierre = NOW(), estado = 'CERRADO'
       WHERE id = (
         SELECT id FROM accesos
         WHERE salon = $1 AND estado = 'ABIERTO'
         ORDER BY hora_apertura DESC
         LIMIT 1
       )
       RETURNING *`,
      [salon]
    )

    const closed = (result as any).rows?.[0] || null
    if (!closed) {
      console.log("[v0] PUT /api/accesos/cerrar: no se encontró acceso abierto para cerrar")
      return NextResponse.json(
        { success: false, error: "No hay un acceso abierto para este salón" },
        { status: 404 }
      )
    }

    console.log("[v0] PUT /api/accesos/cerrar: acceso cerrado:", closed)
    return NextResponse.json({
      success: true,
      message: "Salón cerrado correctamente",
      data: closed,
    })
  } catch (error: any) {
    console.error("[v0] PUT /api/accesos/cerrar error:", error.message, error.code)
    return NextResponse.json(
      { success: false, error: "Error al cerrar el salón" },
      { status: 500 }
    )
  }
}
