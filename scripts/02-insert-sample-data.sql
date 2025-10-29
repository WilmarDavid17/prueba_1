-- Script para insertar datos de ejemplo
-- Universidad Cooperativa de Colombia - Sede Santa Marta

USE control_acceso_ucc;

-- Insertar profesores de ejemplo
INSERT INTO profesores (rfid, nombre, apellido, email, telefono) VALUES
('RFID-001-CR', 'Carlos', 'Ruiz', 'carlos.ruiz@ucc.edu.co', '3001234567'),
('RFID-002-PL', 'Patricia', 'López', 'patricia.lopez@ucc.edu.co', '3009876543'),
('RFID-003-MT', 'Miguel Ángel', 'Torres', 'miguel.torres@ucc.edu.co', '3005551234'),
('RFID-004-AG', 'Ana María', 'González', 'ana.gonzalez@ucc.edu.co', '3007778888'),
('RFID-005-RM', 'Roberto', 'Martínez', 'roberto.martinez@ucc.edu.co', '3004445555');

-- Insertar estudiantes de ejemplo
INSERT INTO estudiantes (id_carnet, nombres, apellidos, rfid) VALUES
('EST-2024001', 'Juan Carlos', 'Pérez García', 'RFID-EST-001'),
('EST-2024002', 'María Fernanda', 'Rodríguez López', 'RFID-EST-002'),
('EST-2024003', 'Andrés Felipe', 'Martínez Silva', 'RFID-EST-003'),
('EST-2024004', 'Laura Valentina', 'González Ramírez', 'RFID-EST-004'),
('EST-2024005', 'Diego Alejandro', 'Hernández Castro', 'RFID-EST-005');

-- Insertar algunos accesos de ejemplo
INSERT INTO accesos (rfid, nombre_profesor, salon, hora_apertura, hora_cierre, estado) VALUES
('RFID-001-CR', 'Dr. Carlos Ruiz', 'A-102', NOW() - INTERVAL 1 HOUR, NULL, 'ABIERTO'),
('RFID-002-PL', 'Dra. Patricia López', 'B-101', NOW() - INTERVAL 2 HOUR, NULL, 'ABIERTO'),
('RFID-003-MT', 'Dr. Miguel Ángel Torres', 'A-201', NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 3 HOUR, 'CERRADO');

-- Insertar algunas asistencias de ejemplo
INSERT INTO asistencias (id_carnet, nombres, apellidos, hora_entrada) VALUES
('EST-2024001', 'Juan Carlos', 'Pérez García', NOW() - INTERVAL 30 MINUTE),
('EST-2024002', 'María Fernanda', 'Rodríguez López', NOW() - INTERVAL 45 MINUTE),
('EST-2024003', 'Andrés Felipe', 'Martínez Silva', NOW() - INTERVAL 1 HOUR);
