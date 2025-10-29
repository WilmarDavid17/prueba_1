-- Script para crear la tabla de asistencias de estudiantes
-- Ejecutar en MySQL Workbench

USE control_acceso_salones;

-- Crear tabla de asistencias
CREATE TABLE IF NOT EXISTS asistencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_carnet VARCHAR(20) NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  hora_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_id_carnet (id_carnet),
  INDEX idx_fecha (hora_entrada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo
INSERT INTO asistencias (id_carnet, nombres, apellidos, hora_entrada) VALUES
('2021001', 'Juan Carlos', 'Pérez García', '2025-01-15 08:15:00'),
('2021002', 'María Fernanda', 'López Martínez', '2025-01-15 08:20:00'),
('2021003', 'Carlos Alberto', 'Rodríguez Silva', '2025-01-15 08:25:00'),
('2021004', 'Ana María', 'González Torres', '2025-01-15 08:30:00'),
('2021005', 'Luis Eduardo', 'Ramírez Castro', '2025-01-15 08:35:00');

SELECT 'Tabla de asistencias creada exitosamente' AS mensaje;
