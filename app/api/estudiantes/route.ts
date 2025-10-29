import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET - Obtener todos los estudiantes
export async function GET() {
  try {
    const estudiantes = await query("SELECT * FROM estudiantes WHERE activo = TRUE ORDER BY id DESC")

    return NextResponse.json({
      success: true,
      data: estudiantes,
    })
  } catch (error) {
    console.error("[v0] Error fetching estudiantes:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener estudiantes",
      },
      { status: 500 },
    )
  }
}

// POST - Crear nuevo estudiante
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id_carnet, nombres, apellidos, rfid } = body

    if (!id_carnet || !nombres || !apellidos) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan campos requeridos",
        },
        { status: 400 },
      )
    }

    const result = await query("INSERT INTO estudiantes (id_carnet, nombres, apellidos, rfid) VALUES (?, ?, ?, ?)", [
      id_carnet,
      nombres,
      apellidos,
      rfid || null,
    ])

    return NextResponse.json({
      success: true,
      data: { id: result.insertId, id_carnet, nombres, apellidos, rfid },
    })
  } catch (error: any) {
    console.error("[v0] Error creating estudiante:", error)

    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          success: false,
          error: "El ID de carnet o RFID ya existe",
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Error al crear estudiante",
      },
      { status: 500 },
    )
  }
}

// PUT - Actualizar estudiante
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, id_carnet, nombres, apellidos, rfid } = body

    if (!id || !id_carnet || !nombres || !apellidos) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan campos requeridos",
        },
        { status: 400 },
      )
    }

    await query("UPDATE estudiantes SET id_carnet = ?, nombres = ?, apellidos = ?, rfid = ? WHERE id = ?", [
      id_carnet,
      nombres,
      apellidos,
      rfid || null,
      id,
    ])

    return NextResponse.json({
      success: true,
      data: { id, id_carnet, nombres, apellidos, rfid },
    })
  } catch (error: any) {
    console.error("[v0] Error updating estudiante:", error)

    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          success: false,
          error: "El ID de carnet o RFID ya existe",
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Error al actualizar estudiante",
      },
      { status: 500 },
    )
  }
}

// DELETE - Eliminar estudiante (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID requerido",
        },
        { status: 400 },
      )
    }

    await query("UPDATE estudiantes SET activo = FALSE WHERE id = ?", [id])

    return NextResponse.json({
      success: true,
      message: "Estudiante eliminado correctamente",
    })
  } catch (error) {
    console.error("[v0] Error deleting estudiante:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar estudiante",
      },
      { status: 500 },
    )
  }
}
