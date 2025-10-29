"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { UserPlus, Edit, Trash2, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Estudiante {
  id: number
  id_carnet: string
  nombres: string
  apellidos: string
  rfid: string | null
  fecha_registro: string
  activo: boolean
}

export function StudentManagement() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Estudiante | null>(null)

  const [formData, setFormData] = useState({
    id_carnet: "",
    nombres: "",
    apellidos: "",
    rfid: "",
  })

  const loadEstudiantes = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/estudiantes")
      const result = await response.json()
      if (result.success) {
        setEstudiantes(result.data)
      }
    } catch (error) {
      console.error("[v0] Error loading estudiantes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEstudiantes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = "/api/estudiantes"
      const method = editingStudent ? "PUT" : "POST"
      const body = editingStudent ? { ...formData, id: editingStudent.id } : formData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.success) {
        alert(editingStudent ? "Estudiante actualizado correctamente" : "Estudiante agregado correctamente")
        setIsDialogOpen(false)
        resetForm()
        loadEstudiantes()
      } else {
        alert("Error: " + result.error)
      }
    } catch (error) {
      console.error("[v0] Error saving estudiante:", error)
      alert("Error al guardar estudiante")
    }
  }

  const handleEdit = (estudiante: Estudiante) => {
    setEditingStudent(estudiante)
    setFormData({
      id_carnet: estudiante.id_carnet,
      nombres: estudiante.nombres,
      apellidos: estudiante.apellidos,
      rfid: estudiante.rfid || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este estudiante?")) return

    try {
      const response = await fetch(`/api/estudiantes?id=${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        alert("Estudiante eliminado correctamente")
        loadEstudiantes()
      } else {
        alert("Error: " + result.error)
      }
    } catch (error) {
      console.error("[v0] Error deleting estudiante:", error)
      alert("Error al eliminar estudiante")
    }
  }

  const resetForm = () => {
    setFormData({ id_carnet: "", nombres: "", apellidos: "", rfid: "" })
    setEditingStudent(null)
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  return (
    <Card className="shadow-lg bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-[#00bcd4] to-[#8bc34a] p-2 rounded-lg">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            Gestión de Carnets Estudiantiles
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadEstudiantes}
              disabled={loading}
              className="border-[#00bcd4] text-[#00bcd4] hover:bg-[#e0f2f1] bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button className="bg-[#00bcd4] hover:bg-[#0097a7] text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Agregar Estudiante
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingStudent ? "Editar Estudiante" : "Agregar Nuevo Estudiante"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id_carnet">ID Carnet *</Label>
                    <Input
                      id="id_carnet"
                      value={formData.id_carnet}
                      onChange={(e) => setFormData({ ...formData, id_carnet: e.target.value })}
                      placeholder="Ej: 2021001"
                      required
                      className="border-[#00bcd4]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombres">Nombres *</Label>
                    <Input
                      id="nombres"
                      value={formData.nombres}
                      onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                      placeholder="Ej: Juan Carlos"
                      required
                      className="border-[#00bcd4]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellidos">Apellidos *</Label>
                    <Input
                      id="apellidos"
                      value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                      placeholder="Ej: Pérez García"
                      required
                      className="border-[#00bcd4]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rfid">RFID / Huella (Opcional)</Label>
                    <Input
                      id="rfid"
                      value={formData.rfid}
                      onChange={(e) => setFormData({ ...formData, rfid: e.target.value })}
                      placeholder="Ej: RFID-EST-001"
                      className="border-[#00bcd4]"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => handleDialogClose(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1 bg-[#00bcd4] hover:bg-[#0097a7] text-white">
                      {editingStudent ? "Actualizar" : "Agregar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-[#64748b]">Cargando estudiantes...</div>
        ) : estudiantes.length === 0 ? (
          <div className="text-center py-8 text-[#64748b]">No hay estudiantes registrados</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#00bcd4] to-[#8bc34a] text-white">
                  <th className="p-3 text-left font-semibold">ID</th>
                  <th className="p-3 text-left font-semibold">ID Carnet</th>
                  <th className="p-3 text-left font-semibold">Nombres</th>
                  <th className="p-3 text-left font-semibold">Apellidos</th>
                  <th className="p-3 text-left font-semibold">RFID</th>
                  <th className="p-3 text-left font-semibold">Fecha Registro</th>
                  <th className="p-3 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((estudiante, index) => (
                  <tr
                    key={estudiante.id}
                    className={`border-b border-[#e2e8f0] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                    } hover:bg-[#e0f2f1] transition-colors`}
                  >
                    <td className="p-3 font-semibold text-[#1e293b]">{estudiante.id}</td>
                    <td className="p-3">
                      <Badge className="bg-[#e0f2f1] text-[#00bcd4] font-mono hover:bg-[#e0f2f1]">
                        {estudiante.id_carnet}
                      </Badge>
                    </td>
                    <td className="p-3 text-[#1e293b] font-medium">{estudiante.nombres}</td>
                    <td className="p-3 text-[#1e293b] font-medium">{estudiante.apellidos}</td>
                    <td className="p-3 text-[#475569] font-mono text-sm">{estudiante.rfid || "-"}</td>
                    <td className="p-3 text-[#475569] text-sm">
                      {new Date(estudiante.fecha_registro).toLocaleDateString("es-CO")}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(estudiante)}
                          className="border-[#00bcd4] text-[#00bcd4] hover:bg-[#e0f2f1] bg-transparent"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(estudiante.id)}
                          className="border-red-500 text-red-500 hover:bg-red-50 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
