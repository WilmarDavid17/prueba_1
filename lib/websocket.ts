// /lib/websocket.ts
import { WebSocketServer } from "ws"
import { query } from "@/lib/db"

let wss: WebSocketServer | null = null

export function initWebSocket(server: any) {
  if (wss) return wss // evitar crear varios

  wss = new WebSocketServer({ server })

  wss.on("connection", (ws) => {
    console.log("🟢 Nueva conexión WebSocket desde ESP32")

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString())

        // Mensaje desde la ESP32: { type: "scan", rfid: "123ABC" }
        if (data.type === "scan" && data.rfid) {
          const [profesor] = await query("SELECT * FROM profesores WHERE rfid = ?", [data.rfid])

          if (profesor) {
            ws.send(
              JSON.stringify({
                type: "found",
                message: `Acceso permitido: ${profesor.nombre}`,
                profesor,
              })
            )
          } else {
            ws.send(
              JSON.stringify({
                type: "not_found",
                message: "Tarjeta no registrada",
              })
            )
          }
        }

        // Registro nuevo: { type: "register", rfid: "123ABC", nombre: "Carlos" }
        if (data.type === "register" && data.rfid && data.nombre) {
          await query("INSERT INTO profesores (rfid, nombre) VALUES (?, ?)", [data.rfid, data.nombre])
          ws.send(
            JSON.stringify({
              type: "registered",
              message: "Profesor registrado correctamente",
            })
          )
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
