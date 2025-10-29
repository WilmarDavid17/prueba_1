# Sistema de Control de Acceso a Salones
## Universidad Cooperativa de Colombia - Sede Santa Marta

Sistema completo de control de acceso a salones con registro de entradas y salidas mediante RFID, y sistema de registro de asistencias de estudiantes con sensor biométrico AS608.

## Características

### Control de Acceso a Salones
- Control de acceso a salones en tiempo real
- Registro de profesores con códigos RFID
- Historial completo de accesos (apertura y cierre)
- Interfaz intuitiva con colores institucionales de la UCC
- Base de datos MySQL para persistencia de datos

### Registro de Asistencias de Estudiantes
- Registro de asistencias mediante sensor biométrico AS608 Arduino
- Captura de huella digital para identificación de estudiantes
- Registro automático de hora de entrada
- Tabla de asistencias en tiempo real
- Endpoint API para integración con Arduino

## Requisitos Previos

- Node.js 18+ instalado
- MySQL Server 8.0+ o MySQL Workbench
- Navegador web moderno
- Arduino IDE instalado
- Sensor biométrico AS608 conectado a Arduino

## Configuración de la Base de Datos

### 1. Crear la Base de Datos en MySQL Workbench

1. Abre MySQL Workbench
2. Conéctate a tu servidor MySQL
3. Abre el archivo `scripts/01-create-database.sql`
4. Ejecuta el script completo (esto creará la base de datos y las tablas)
5. Abre el archivo `scripts/02-insert-sample-data.sql`
6. Ejecuta el script para insertar datos de ejemplo
7. Abre el archivo `scripts/03-create-asistencias-table.sql`
8. Ejecuta el script para crear la tabla de asistencias

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=misionTic2022
DB_NAME=control_acceso_salones
DB_PORT=3306
\`\`\`

**Importante:** Ajusta estos valores según tu configuración de MySQL:
- `DB_HOST`: Dirección del servidor MySQL (normalmente `localhost`)
- `DB_USER`: Usuario de MySQL (normalmente `root`)
- `DB_PASSWORD`: Tu contraseña de MySQL
- `DB_NAME`: Nombre de la base de datos (debe ser `control_acceso_salones`)
- `DB_PORT`: Puerto de MySQL (normalmente `3306`)

## Instalación

1. Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

2. Inicia el servidor de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

3. Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## Estructura de la Base de Datos

### Tabla: `accesos`
Tabla principal que registra todos los accesos a los salones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único del registro (auto-incremental) |
| rfid | VARCHAR(50) | Código RFID del profesor |
| nombre_profesor | VARCHAR(255) | Nombre completo del profesor |
| salon | VARCHAR(50) | Número del salón (ej: A-101) |
| hora_apertura | DATETIME | Fecha y hora de apertura del salón |
| hora_cierre | DATETIME | Fecha y hora de cierre del salón (NULL si está abierto) |
| estado | ENUM | Estado actual: 'ABIERTO' o 'CERRADO' |

### Tabla: `asistencias`
Tabla que registra las asistencias de estudiantes mediante sensor AS608.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único del registro (auto-incremental) |
| id_carnet | VARCHAR(20) | Número de identificación del estudiante |
| nombres | VARCHAR(100) | Nombres del estudiante |
| apellidos | VARCHAR(100) | Apellidos del estudiante |
| hora_entrada | DATETIME | Fecha y hora de entrada (auto-generada) |

### Tabla: `profesores` (Opcional)
Gestión de profesores registrados en el sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único del profesor |
| rfid | VARCHAR(50) | Código RFID único |
| nombre | VARCHAR(255) | Nombre completo |
| email | VARCHAR(255) | Correo electrónico |
| telefono | VARCHAR(20) | Número de teléfono |
| activo | BOOLEAN | Estado del profesor |

### Tabla: `salones` (Opcional)
Catálogo de salones disponibles.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único del salón |
| numero | VARCHAR(50) | Número del salón |
| capacidad | INT | Capacidad de personas |
| piso | VARCHAR(50) | Ubicación (piso) |
| edificio | VARCHAR(50) | Edificio |
| activo | BOOLEAN | Estado del salón |

## Uso del Sistema

### Control de Acceso

1. Selecciona un profesor del menú desplegable "Lector RFID Docente"
2. Haz clic en "Escanear Carnet Docente" para verificar el RFID
3. Selecciona un salón disponible
4. Haz clic en "ABRIR SALÓN" para registrar el acceso
5. Cuando termines, haz clic en "CERRAR SALÓN"

### Registro de Accesos

- Ve a la pestaña "Registro de Accesos"
- Visualiza todos los accesos registrados en la base de datos
- Usa el botón "Actualizar" para recargar los datos
- La tabla muestra: ID, RFID, Profesor, Salón, Hora de Apertura, Hora de Cierre y Estado

### Registro de Asistencias (Sensor AS608)

1. Accede a la página de asistencias en `/asistencias`
2. El sistema mostrará el estado del sensor AS608
3. Para registrar manualmente (pruebas):
   - Ingresa el ID del carnet del estudiante
   - Ingresa nombres y apellidos
   - Haz clic en "Registrar Asistencia"
4. Para integración con Arduino AS608:
   - Configura tu Arduino para enviar datos al endpoint `/api/asistencias/arduino`
   - El sistema registrará automáticamente la asistencia

## API Endpoints

### Control de Acceso

#### GET `/api/accesos`
Obtiene todos los registros de acceso (últimos 100).

**Respuesta:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "rfid": "RFID-001-CR",
      "nombre_profesor": "Dr. Carlos Ruiz",
      "salon": "A-102",
      "hora_apertura": "2025-01-15T10:30:00",
      "hora_cierre": null,
      "estado": "ABIERTO"
    }
  ]
}
\`\`\`

#### POST `/api/accesos`
Registra un nuevo acceso (abre un salón).

**Body:**
\`\`\`json
{
  "rfid": "RFID-001-CR",
  "nombre_profesor": "Dr. Carlos Ruiz",
  "salon": "A-102"
}
\`\`\`

#### PUT `/api/accesos/cerrar`
Cierra un salón (actualiza el registro de acceso).

**Body:**
\`\`\`json
{
  "salon": "A-102"
}
\`\`\`

### Registro de Asistencias

#### GET `/api/asistencias`
Obtiene todos los registros de asistencias (últimos 100).

**Respuesta:**
\`\`\`json
[
  {
    "id": 1,
    "id_carnet": "2021001",
    "nombres": "Juan Carlos",
    "apellidos": "Pérez García",
    "hora_entrada": "2025-01-15T08:15:00"
  }
]
\`\`\`

#### POST `/api/asistencias`
Registra una nueva asistencia manualmente.

**Body:**
\`\`\`json
{
  "id_carnet": "2021001",
  "nombres": "Juan Carlos",
  "apellidos": "Pérez García"
}
\`\`\`

#### POST `/api/asistencias/arduino`
Endpoint para recibir datos del sensor AS608 Arduino.

**Body:**
\`\`\`json
{
  "fingerprint_id": 1,
  "id_carnet": "2021001",
  "nombres": "Juan Carlos",
  "apellidos": "Pérez García"
}
\`\`\`

**Respuesta:**
\`\`\`json
{
  "success": true,
  "message": "Asistencia registrada correctamente",
  "data": {
    "id": 1,
    "id_carnet": "2021001",
    "nombres": "Juan Carlos",
    "apellidos": "Pérez García",
    "hora_entrada": "2025-01-15T08:15:00"
  }
}
\`\`\`

## Integración con Arduino AS608

### Código de Ejemplo para Arduino

\`\`\`cpp
#include <Adafruit_Fingerprint.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// Configuración WiFi
const char* ssid = "TU_WIFI";
const char* password = "TU_PASSWORD";

// URL del servidor
const char* serverUrl = "http://TU_IP:3000/api/asistencias/arduino";

// Sensor AS608
SoftwareSerial mySerial(D2, D3);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

void setup() {
  Serial.begin(115200);
  
  // Conectar WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  // Inicializar sensor
  finger.begin(57600);
  if (finger.verifyPassword()) {
    Serial.println("Sensor AS608 encontrado!");
  }
}

void loop() {
  uint8_t id = getFingerprintID();
  
  if (id != 255) {
    // Buscar datos del estudiante según el ID de huella
    String idCarnet = getStudentID(id);
    String nombres = getStudentFirstName(id);
    String apellidos = getStudentLastName(id);
    
    // Enviar al servidor
    sendAttendance(id, idCarnet, nombres, apellidos);
    
    delay(3000); // Esperar 3 segundos antes del siguiente escaneo
  }
}

uint8_t getFingerprintID() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) return 255;
  
  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return 255;
  
  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK) return 255;
  
  return finger.fingerID;
}

void sendAttendance(int fingerprintId, String idCarnet, String nombres, String apellidos) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient client;
    
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    String jsonData = "{";
    jsonData += "\\"fingerprint_id\\":" + String(fingerprintId) + ",";
    jsonData += "\\"id_carnet\\":\\"" + idCarnet + "\\",";
    jsonData += "\\"nombres\\":\\"" + nombres + "\\",";
    jsonData += "\\"apellidos\\":\\"" + apellidos + "\\"";
    jsonData += "}";
    
    int httpCode = http.POST(jsonData);
    
    if (httpCode > 0) {
      String response = http.getString();
      Serial.println("Respuesta: " + response);
    }
    
    http.end();
  }
}
\`\`\`

## Solución de Problemas

### Error de conexión a la base de datos

1. Verifica que MySQL esté ejecutándose
2. Confirma que las credenciales en `.env.local` sean correctas
3. Asegúrate de que la base de datos `control_acceso_salones` exista
4. Verifica que el usuario tenga permisos sobre la base de datos

### Los datos no se guardan

1. Revisa la consola del navegador para errores
2. Verifica que los scripts SQL se hayan ejecutado correctamente
3. Confirma que las tablas existan en la base de datos

### Problemas con Arduino

1. Asegúrate de que el sensor AS608 esté correctamente conectado a Arduino
2. Verifica que el código de Arduino esté configurado correctamente con tu WiFi y la dirección IP del servidor
3. Confirma que el servidor esté ejecutándose y accesible desde Arduino

## Tecnologías Utilizadas

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **MySQL** - Base de datos relacional
- **mysql2** - Driver de MySQL para Node.js
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes de UI
- **Lucide React** - Iconos
- **Arduino AS608** - Sensor biométrico de huellas digitales

## Licencia

Sistema desarrollado para la Universidad Cooperativa de Colombia - Sede Santa Marta.
