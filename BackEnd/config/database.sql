-- ============================================================
-- TECSOMAC — Script de creación de base de datos
-- Motor: MySQL 8.x
-- ============================================================

CREATE DATABASE IF NOT EXISTS tecsomac_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tecsomac_db;

-- ────────────────────────────────────────────────────────────
-- Tabla: rol
-- Almacena los roles del sistema (Administrador / Operario)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rol (
  id_rol     INT          NOT NULL AUTO_INCREMENT,
  nombre_rol VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_rol)
);

-- ────────────────────────────────────────────────────────────
-- Tabla: usuario_sistema
-- Usuarios que acceden a la plataforma web
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuario_sistema (
  id_usuario      INT          NOT NULL AUTO_INCREMENT,
  id_rol          INT          NOT NULL,
  nombre          VARCHAR(100) NOT NULL,
  correo          VARCHAR(100) NOT NULL UNIQUE,
  contrasena_hash VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_usuario),
  FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);

-- ────────────────────────────────────────────────────────────
-- Tabla: maquina
-- Equipos de cómputo monitoreados por el sistema
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS maquina (
  id_maquina     INT          NOT NULL AUTO_INCREMENT,
  numero_maquina VARCHAR(100) NOT NULL,
  mac_address    VARCHAR(100) NOT NULL UNIQUE,
  licencia_activa TINYINT(1)  NOT NULL DEFAULT 1,
  PRIMARY KEY (id_maquina)
);

-- ────────────────────────────────────────────────────────────
-- Tabla: periferico
-- Tipos de periféricos que pueden desconectarse
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS periferico (
  id_periferico INT          NOT NULL AUTO_INCREMENT,
  nombre        VARCHAR(100) NOT NULL,
  tipo          VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_periferico)
);

-- ────────────────────────────────────────────────────────────
-- Tabla: registro_actividad
-- Historial de eventos generados por las máquinas
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS registro_actividad (
  id_registro    INT          NOT NULL AUTO_INCREMENT,
  id_maquina     INT          NOT NULL,
  id_periferico  INT          NOT NULL,
  nombre_cliente VARCHAR(100) NOT NULL,
  fecha_hora     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tipo_evento    VARCHAR(100) NOT NULL,
  verificado     TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (id_registro),
  FOREIGN KEY (id_maquina)    REFERENCES maquina(id_maquina),
  FOREIGN KEY (id_periferico) REFERENCES periferico(id_periferico)
);

-- ────────────────────────────────────────────────────────────
-- Datos iniciales
-- ────────────────────────────────────────────────────────────
INSERT INTO rol (nombre_rol) VALUES ('Administrador'), ('Operario');

INSERT INTO periferico (nombre, tipo) VALUES
  ('Teclado USB',    'USB'),
  ('Mouse USB',      'USB'),
  ('Headset JACK',   'JACK'),
  ('Monitor HDMI',   'HDMI');

-- Contraseña: Admin123* (hash bcrypt)
INSERT INTO usuario_sistema (id_rol, nombre, correo, contrasena_hash) VALUES
  (1, 'Administrador TECSOMAC', 'admin@tecsomac.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh1K');
  
//
