-- Base de datos para el Sistema de Control de Acceso
-- Universidad Cooperativa de Colombia - Sede Santa Marta

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS control_acceso_ucc;
USE control_acceso_ucc;

-- Tabla de Profesores
CREATE TABLE IF NOT EXISTS profesores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rfid VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE,
  telefono VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_carnet VARCHAR(50) UNIQUE NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  rfid VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Accesos a Salones
CREATE TABLE IF NOT EXISTS accesos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rfid VARCHAR(50) NOT NULL,
  nombre_profesor VARCHAR(200) NOT NULL,
  salon VARCHAR(50) NOT NULL,
  hora_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  hora_cierre TIMESTAMP NULL,
  estado ENUM('ABIERTO', 'CERRADO') DEFAULT 'ABIERTO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rfid) REFERENCES profesores(rfid) ON DELETE CASCADE
);

-- Tabla de Asistencias de Estudiantes
CREATE TABLE IF NOT EXISTS asistencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_carnet VARCHAR(50) NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  hora_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_carnet) REFERENCES estudiantes(id_carnet) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_accesos_salon ON accesos(salon);
CREATE INDEX idx_accesos_estado ON accesos(estado);
CREATE INDEX idx_accesos_fecha ON accesos(hora_apertura);
CREATE INDEX idx_asistencias_fecha ON asistencias(hora_entrada);
CREATE INDEX idx_asistencias_carnet ON asistencias(id_carnet);
