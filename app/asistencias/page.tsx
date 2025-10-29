"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Fingerprint, RefreshCw, Clock, ArrowLeft, UserPlus } from "lucide-react"

interface Asistencia {
  id: number
  id_carnet: string
  nombres: string
  apellidos: string
  hora_entrada: string
}

export default function AsistenciasPage() {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([])
  const [loading, setLoading] = useState(true)
  const [sensorStatus, setSensorStatus] = useState<"waiting" | "scanning" | "success" | "error">("waiting")
  const [lastScanned, setLastScanned] = useState<string>("")

  const [manualForm, setManualForm] = useState({
    id_carnet: "",
    nombres: "",
    apellidos: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadAsistencias = async () => {
    try {
      const response = await fetch("/api/asistencias")
      if (response.ok) {
        const data = await response.json()
        setAsistencias(data)
      }
    } catch (error) {
      console.error("[v0] Error loading asistencias:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAsistencias()
    const interval = setInterval(() => {
      console.log("[v0] Polling AS608 sensor...")
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const simulateFingerprintScan = () => {
    setSensorStatus("scanning")
    setLastScanned("")

    setTimeout(() => {
      const mockStudent = {
        id_carnet: "EST-" + Math.floor(Math.random() * 10000),
        nombres: "Estudiante",
        apellidos: "Demo",
      }

      fetch("/api/asistencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockStudent),
      })
        .then((res) => res.json())
        .then(() => {
          setSensorStatus("success")
          setLastScanned(`${mockStudent.nombres} ${mockStudent.apellidos}`)
          loadAsistencias()
          setTimeout(() => {
            setSensorStatus("waiting")
            setLastScanned("")
          }, 3000)
        })
        .catch(() => {
          setSensorStatus("error")
          setTimeout(() => setSensorStatus("waiting"), 2000)
        })
    }, 2000)
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!manualForm.id_carnet || !manualForm.nombres || !manualForm.apellidos) {
      alert("Por favor complete todos los campos")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/asistencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualForm),
      })

      if (response.ok) {
        alert("Asistencia registrada correctamente")
        setManualForm({ id_carnet: "", nombres: "", apellidos: "" })
        loadAsistencias()
      } else {
        const error = await response.json()
        alert("Error al registrar asistencia: " + error.error)
      }
    } catch (error) {
      console.error("[v0] Error submitting manual attendance:", error)
      alert("Error al conectar con la base de datos")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00bcd4] via-[#26c6da] to-[#8bc34a]">
      <header className="bg-white text-[#475569] py-6 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-4">
            <Image
              src="/logo-ucc.png"
              alt="Universidad Cooperativa de Colombia"
              width={100}
              height={100}
              className="object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-[#334155]">Registro de Asistencias</h1>
              <p className="text-base text-[#64748b] mt-1">Universidad Cooperativa de Colombia - Sede Santa Marta</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/">
              <Button
                variant="outline"
                className="border-[#00bcd4] text-[#00bcd4] hover:bg-[#e0f2f1] font-semibold bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Control de Acceso
              </Button>
            </Link>
            <Button className="bg-[#00bcd4] hover:bg-[#0097a7] text-white font-semibold">
              <Fingerprint className="w-4 h-4 mr-2" />
              Registro de Asistencias
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          <Card className="shadow-lg bg-white border-2 border-[#8bc34a]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-[#00bcd4] to-[#8bc34a] p-2 rounded-lg">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                Registro Manual de Asistencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id_carnet" className="text-[#1e293b] font-semibold">
                      ID Carnet
                    </Label>
                    <Input
                      id="id_carnet"
                      placeholder="EST-2024001"
                      value={manualForm.id_carnet}
                      onChange={(e) => setManualForm({ ...manualForm, id_carnet: e.target.value })}
                      className="border-[#00bcd4] focus:ring-[#00bcd4]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombres" className="text-[#1e293b] font-semibold">
                      Nombres
                    </Label>
                    <Input
                      id="nombres"
                      placeholder="Juan Carlos"
                      value={manualForm.nombres}
                      onChange={(e) => setManualForm({ ...manualForm, nombres: e.target.value })}
                      className="border-[#00bcd4] focus:ring-[#00bcd4]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellidos" className="text-[#1e293b] font-semibold">
                      Apellidos
                    </Label>
                    <Input
                      id="apellidos"
                      placeholder="Pérez García"
                      value={manualForm.apellidos}
                      onChange={(e) => setManualForm({ ...manualForm, apellidos: e.target.value })}
                      className="border-[#00bcd4] focus:ring-[#00bcd4]"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#8bc34a] hover:bg-[#7cb342] text-white font-semibold"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Registrando..." : "Registrar Asistencia"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white border-2 border-[#00bcd4]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-[#00bcd4] to-[#8bc34a] p-2 rounded-lg">
                  <Fingerprint className="w-5 h-5 text-white" />
                </div>
                Sensor de Huella AS608 - Arduino
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div
                    className={`w-40 h-40 rounded-full flex items-center justify-center transition-all ${
                      sensorStatus === "waiting"
                        ? "bg-gray-100"
                        : sensorStatus === "scanning"
                          ? "bg-[#e0f2f1] animate-pulse"
                          : sensorStatus === "success"
                            ? "bg-[#dcfce7]"
                            : "bg-[#fee2e2]"
                    }`}
                  >
                    <Fingerprint
                      className={`w-20 h-20 ${
                        sensorStatus === "waiting"
                          ? "text-gray-400"
                          : sensorStatus === "scanning"
                            ? "text-[#00bcd4]"
                            : sensorStatus === "success"
                              ? "text-[#22c55e]"
                              : "text-[#ef4444]"
                      }`}
                    />
                  </div>

                  <Badge
                    className={`text-base px-4 py-2 ${
                      sensorStatus === "waiting"
                        ? "bg-gray-200 text-gray-700"
                        : sensorStatus === "scanning"
                          ? "bg-[#00bcd4] text-white"
                          : sensorStatus === "success"
                            ? "bg-[#22c55e] text-white"
                            : "bg-[#ef4444] text-white"
                    } font-semibold`}
                  >
                    {sensorStatus === "waiting" && "Esperando huella..."}
                    {sensorStatus === "scanning" && "Escaneando huella..."}
                    {sensorStatus === "success" && "¡Registrado!"}
                    {sensorStatus === "error" && "Error en el registro"}
                  </Badge>

                  {lastScanned && (
                    <p className="text-sm text-[#1e293b] font-semibold">Último registro: {lastScanned}</p>
                  )}

                  <Button
                    onClick={simulateFingerprintScan}
                    disabled={sensorStatus === "scanning"}
                    className="mt-4 bg-[#00bcd4] hover:bg-[#0097a7] text-white font-semibold"
                  >
                    <Fingerprint className="w-4 h-4 mr-2" />
                    Simular Escaneo AS608
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#e0f2f1] p-4 rounded-lg">
                    <h4 className="font-bold text-[#1e293b] mb-2">Estado del Sensor</h4>
                    <div className="space-y-2 text-sm text-[#475569]">
                      <p>
                        <strong>Modelo:</strong> AS608 Fingerprint Sensor
                      </p>
                      <p>
                        <strong>Conexión:</strong> Arduino → USB → API
                      </p>
                      <p>
                        <strong>Endpoint:</strong> POST /api/asistencias/arduino
                      </p>
                      <p>
                        <strong>Estado:</strong> <span className="text-[#22c55e] font-semibold">Conectado</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#e2e8f0]">
                    <h4 className="font-bold text-[#1e293b] mb-2">Instrucciones</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-[#475569]">
                      <li>Coloque el dedo en el sensor AS608</li>
                      <li>Espere la confirmación visual</li>
                      <li>El sistema registrará automáticamente</li>
                      <li>Verifique en la tabla de asistencias</li>
                    </ol>
                  </div>

                  <div className="bg-[#fff4e6] p-4 rounded-lg border border-[#fb923c]">
                    <p className="text-xs text-[#9a3412]">
                      <strong>Nota:</strong> El Arduino debe enviar datos JSON con los campos: fingerprint_id,
                      id_carnet, nombres, apellidos al endpoint /api/asistencias/arduino
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-[#00bcd4] to-[#8bc34a] p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  Registro de Asistencias
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadAsistencias}
                  disabled={loading}
                  className="border-[#00bcd4] text-[#00bcd4] hover:bg-[#e0f2f1] bg-transparent"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Actualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-[#64748b]">Cargando asistencias...</div>
              ) : asistencias.length === 0 ? (
                <div className="text-center py-8 text-[#64748b]">No hay asistencias registradas</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#00bcd4] to-[#8bc34a] text-white">
                        <th className="p-3 text-left font-semibold">ID</th>
                        <th className="p-3 text-left font-semibold">ID Carnet</th>
                        <th className="p-3 text-left font-semibold">Nombres</th>
                        <th className="p-3 text-left font-semibold">Apellidos</th>
                        <th className="p-3 text-left font-semibold">Hora de Entrada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asistencias.map((asistencia, index) => (
                        <tr
                          key={asistencia.id}
                          className={`border-b border-[#e2e8f0] ${
                            index % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                          } hover:bg-[#e0f2f1] transition-colors`}
                        >
                          <td className="p-3 font-semibold text-[#1e293b]">{asistencia.id}</td>
                          <td className="p-3">
                            <Badge className="bg-[#e0f2f1] text-[#00bcd4] font-mono hover:bg-[#e0f2f1]">
                              {asistencia.id_carnet}
                            </Badge>
                          </td>
                          <td className="p-3 text-[#1e293b] font-medium">{asistencia.nombres}</td>
                          <td className="p-3 text-[#1e293b] font-medium">{asistencia.apellidos}</td>
                          <td className="p-3 text-[#475569] text-sm">{formatDateTime(asistencia.hora_entrada)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
