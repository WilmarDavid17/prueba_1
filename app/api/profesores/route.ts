import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// ✅ Obtener todos los profesores o uno por RFID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rfid = searchParams.get("rfid")

    if (rfid) {
      const [profesor] = await query("SELECT * FROM profesores WHERE rfid = ?", [rfid])
      return NextResponse.json(profesor || null)
    }

    const results = await query("SELECT * FROM profesores ORDER BY id DESC")
    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Error al obtener profesores" }, { status: 500 })
  }
}

// ✅ Registrar profesor desde el panel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rfid, nombre } = body

    if (!rfid || !nombre) {
      return NextResponse.json({ error: "RFID y nombre son requeridos" }, { status: 400 })
    }

    await query("INSERT INTO profesores (rfid, nombre) VALUES (?, ?)", [rfid, nombre])
    return NextResponse.json({ success: true, message: "Profesor agregado correctamente" })
  } catch (error: any) {
    console.error("[v0] Database error:", error)
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "El RFID ya está registrado" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al agregar profesor" }, { status: 500 })
  }
}

// ✅ Actualizar profesor
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const body = await request.json()
    const { nombre, rfid } = body

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    if (nombre && rfid)
      await query("UPDATE profesores SET nombre = ?, rfid = ? WHERE id = ?", [nombre, rfid, id])
    else if (nombre)
      await query("UPDATE profesores SET nombre = ? WHERE id = ?", [nombre, id])
    else if (rfid)
      await query("UPDATE profesores SET rfid = ? WHERE id = ?", [rfid, id])
    else
      return NextResponse.json({ error: "Debe enviar al menos un campo" }, { status: 400 })

    return NextResponse.json({ success: true, message: "Profesor actualizado correctamente" })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Error al actualizar profesor" }, { status: 500 })
  }
}

// ✅ Eliminar profesor
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 })
    }

    await query("DELETE FROM profesores WHERE id = ?", [id])

    return NextResponse.json({ success: true, message: "Profesor eliminado correctamente" })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Error al eliminar profesor" }, { status: 500 })
  }
}
