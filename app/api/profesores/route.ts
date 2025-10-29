import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rfid = searchParams.get("rfid")

    if (rfid) {
      const result = await query("SELECT * FROM profesores WHERE rfid = $1", [rfid])
      const rows = (result as any).rows || result
      return NextResponse.json(rows[0] || null)
    }

    const result = await query("SELECT * FROM profesores ORDER BY id DESC")
    const rows = (result as any).rows || result
    // Siempre devolver un array aunque esté vacío
    return NextResponse.json(Array.isArray(rows) ? rows : [])
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Error al obtener profesores" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { rfid, nombre } = await request.json()
    if (!rfid || !nombre) return NextResponse.json({ error: "RFID y nombre son requeridos" }, { status: 400 })

    await query("INSERT INTO profesores (rfid, nombre) VALUES ($1, $2)", [rfid, nombre])
    return NextResponse.json({ success: true, message: "Profesor agregado correctamente" })
  } catch (error: any) {
    console.error("[v0] Database error:", error)
    if (error.code === "ER_DUP_ENTRY" || error.code === "23505") {
      return NextResponse.json({ error: "El RFID ya está registrado" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al agregar profesor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const { nombre, rfid } = await request.json()
    if (!id) return NextResponse.json({ error: "ID es requerido" }, { status: 400 })

    if (nombre && rfid) await query("UPDATE profesores SET nombre = $1, rfid = $2 WHERE id = $3", [nombre, rfid, id])
    else if (nombre) await query("UPDATE profesores SET nombre = $1 WHERE id = $2", [nombre, id])
    else if (rfid) await query("UPDATE profesores SET rfid = $1 WHERE id = $2", [rfid, id])
    else return NextResponse.json({ error: "Debe enviar al menos un campo" }, { status: 400 })

    return NextResponse.json({ success: true, message: "Profesor actualizado correctamente" })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Error al actualizar profesor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID es requerido" }, { status: 400 })

    await query("DELETE FROM profesores WHERE id = $1", [id])
    return NextResponse.json({ success: true, message: "Profesor eliminado correctamente" })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Error al eliminar profesor" }, { status: 500 })
  }
}
