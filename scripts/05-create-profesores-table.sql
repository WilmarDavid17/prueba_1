-- Crear tabla de profesores
CREATE TABLE IF NOT EXISTS profesores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rfid VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO profesores (rfid, nombre) VALUES
('RFID-001-CR', 'Dr. Carlos Ruiz'),
('RFID-002-PL', 'Dra. Patricia López'),
('RFID-003-MT', 'Dr. Miguel Ángel Torres'),
('RFID-004-AG', 'Dra. Ana María González'),
('RFID-005-RM', 'Dr. Roberto Martínez');
