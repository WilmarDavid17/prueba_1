import { WebSocketServer } from "ws"
import { query } from "@/lib/db"

let wss: WebSocketServer | null = null

export function initWebSocket(server: any) {
  if (wss) return wss

  wss = new WebSocketServer({ server })

  wss.on("connection", (ws: { on: (arg0: string, arg1: (message: any) => Promise<void>) => void; send: (arg0: string) => void }) => {
    console.log("🟢 Nueva conexión WebSocket desde ESP32")

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString())

        if (data.type === "scan" && data.rfid) {
          const result = await query("SELECT * FROM profesores WHERE rfid = $1", [data.rfid])
          const profesor = result.rows[0]

          if (profesor) {
            ws.send(
              JSON.stringify({
                type: "found",
                message: `Acceso permitido: ${profesor.nombre}`,
                profesor,
              })
            )
          } else {
            ws.send(JSON.stringify({ type: "not_found", message: "Tarjeta no registrada" }))
          }
        }

        if (data.type === "register" && data.rfid && data.nombre) {
          await query("INSERT INTO profesores (rfid, nombre) VALUES ($1, $2)", [data.rfid, data.nombre])
          ws.send(JSON.stringify({ type: "registered", message: "Profesor registrado correctamente" }))
        }
      } catch (err) {
        console.error("❌ Error procesando mensaje:", err)
        ws.send(JSON.stringify({ type: "error", message: "Error interno del servidor" }))
      }
    })
  })

  console.log("🚀 WebSocket Server iniciado correctamente")
  return wss
}
