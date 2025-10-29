-- Crear tabla de estudiantes para gestión de carnets
CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_carnet VARCHAR(50) UNIQUE NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  rfid VARCHAR(50) UNIQUE,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activo BOOLEAN DEFAULT TRUE
);

-- Insertar datos de ejemplo
INSERT INTO estudiantes (id_carnet, nombres, apellidos, rfid) VALUES
('2021001', 'Juan Carlos', 'Pérez García', 'RFID-EST-001'),
('2021002', 'María Fernanda', 'López Martínez', 'RFID-EST-002'),
('2021003', 'Carlos Alberto', 'Rodríguez Silva', 'RFID-EST-003'),
('2021004', 'Ana María', 'González Torres', 'RFID-EST-004'),
('2021005', 'Luis Fernando', 'Ramírez Castro', 'RFID-EST-005');
