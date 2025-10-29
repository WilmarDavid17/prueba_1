-- Script para crear la base de datos de Control de Acceso a Salones
-- Universidad Cooperativa de Colombia - Sede Santa Marta

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS control_acceso_salones;

-- Usar la base de datos
USE control_acceso_salones;

-- Crear tabla de accesos
CREATE TABLE IF NOT EXISTS accesos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rfid VARCHAR(50) NOT NULL,
  nombre_profesor VARCHAR(255) NOT NULL,
  salon VARCHAR(50) NOT NULL,
  hora_apertura DATETIME NOT NULL,
  hora_cierre DATETIME NULL,
  estado ENUM('ABIERTO', 'CERRADO') NOT NULL DEFAULT 'ABIERTO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rfid (rfid),
  INDEX idx_salon (salon),
  INDEX idx_estado (estado),
  INDEX idx_hora_apertura (hora_apertura)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de profesores (opcional, para gestión de profesores)
CREATE TABLE IF NOT EXISTS profesores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rfid VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(20),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rfid (rfid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de salones (opcional, para gestión de salones)
CREATE TABLE IF NOT EXISTS salones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(50) UNIQUE NOT NULL,
  capacidad INT NOT NULL,
  piso VARCHAR(50) NOT NULL,
  edificio VARCHAR(50) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_numero (numero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
