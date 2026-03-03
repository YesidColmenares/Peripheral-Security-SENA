# TECSOMAC — Backend Node.js
**GA7-220501096-AA2-EV01**

## Repositorio
🔗 [Enlace al repositorio GitHub](https://github.com/YesidColmenares/Peripheral-Security-SENA)

---

## Tecnologías utilizadas
| Tecnología   | Versión  | Propósito                          |
|--------------|----------|------------------------------------|
| Node.js      | 18+      | Entorno de ejecución               |
| Express      | 4.19     | Framework REST API                 |
| Socket.IO    | 4.7      | Comunicación en tiempo real        |
| MySQL2       | 3.9      | Conexión a base de datos MySQL     |
| bcryptjs     | 2.4      | Cifrado de contraseñas             |
| jsonwebtoken | 9.0      | Autenticación JWT                  |

---

## Estructura del proyecto
```
tecsomac-backend/
├── server.js                  # Punto de entrada
├── .env.example               # Variables de entorno (plantilla)
├── config/
│   ├── database.js            # Conexión MySQL (equivalente a JDBC)
│   ├── database.sql           # Script de creación de BD y tablas
│   └── socket.js              # Eventos Socket.IO
├── controllers/
│   ├── authController.js      # Login y registro
│   ├── usuarioController.js   # CRUD usuarios
│   ├── maquinaController.js   # CRUD máquinas + comandos remotos
│   └── registroController.js  # Eventos, historial y dashboard
├── middlewares/
│   └── autenticacion.js       # Verificación JWT
└── routes/
    ├── authRoutes.js
    ├── usuarioRoutes.js
    ├── maquinaRoutes.js
    └── registroRoutes.js
```

---

## Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/YesidColmenares/Peripheral-Security-SENA
cd BackEnd
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
.env
# Editar .env con tus credenciales de MySQL
```

### 4. Crear la base de datos
```bash
mysql -u root -p < config/database.sql
```

### 5. Iniciar el servidor
```bash
# Producción
npm start

# Desarrollo (con recarga automática)
npm run dev
```

---

## Endpoints REST disponibles

### Autenticación
| Método | Ruta                  | Descripción          | Auth |
|--------|-----------------------|----------------------|------|
| POST   | /api/auth/registro    | Crear cuenta         | No   |
| POST   | /api/auth/login       | Iniciar sesión       | No   |

### Usuarios
| Método | Ruta                      | Descripción           | Auth  |
|--------|---------------------------|-----------------------|-------|
| GET    | /api/usuarios             | Listar usuarios       | Admin |
| GET    | /api/usuarios/:id         | Obtener usuario       | Admin |
| PUT    | /api/usuarios/:id/rol     | Cambiar rol           | Admin |
| DELETE | /api/usuarios/:id         | Eliminar usuario      | Admin |

### Máquinas
| Método | Ruta                        | Descripción            | Auth  |
|--------|-----------------------------|------------------------|-------|
| GET    | /api/maquinas               | Listar máquinas        | Token |
| POST   | /api/maquinas               | Registrar máquina      | Admin |
| PUT    | /api/maquinas/:id           | Actualizar máquina     | Admin |
| DELETE | /api/maquinas/:id           | Eliminar máquina       | Admin |
| POST   | /api/maquinas/:id/apagar    | Apagar PC remota       | Admin |
| POST   | /api/maquinas/:id/ejecutar  | Ejecutar app en PC     | Admin |

### Registros
| Método | Ruta                            | Descripción              | Auth  |
|--------|---------------------------------|--------------------------|-------|
| GET    | /api/registros/dashboard        | Estadísticas generales   | Token |
| GET    | /api/registros/notificaciones   | Eventos del día          | Token |
| GET    | /api/registros/historial        | Historial días anteriores| Token |
| POST   | /api/registros                  | Insertar evento (C#)     | No    |
| PUT    | /api/registros/:id/verificar    | Marcar verificado        | Token |

---

## Eventos Socket.IO

| Evento                   | Dirección         | Descripción                        |
|--------------------------|-------------------|------------------------------------|
| `identificar_maquina`    | C# → Servidor     | La PC se registra al conectarse    |
| `periferico_desconectado`| C# → Servidor     | Notifica desconexión de periférico |
| `nueva_notificacion`     | Servidor → Web    | Evento nuevo en tiempo real        |
| `estado_pc`              | Servidor → Web    | Estado de PC (conectado/alerta)    |
| `comando_apagar`         | Servidor → C#     | Ordena apagar la PC                |
| `comando_ejecutar`       | Servidor → C#     | Ordena ejecutar una aplicación     |

---

## Estándares de codificación aplicados
- **Variables y funciones JS:** camelCase (`obtenerUsuarios`, `idMaquina`)
- **Rutas y módulos:** kebab-case (`authRoutes.js`, `maquinaController.js`)
- **Tablas y columnas BD:** snake_case (`usuario_sistema`, `fecha_hora`)
- **Comentarios:** en cada función describiendo parámetros y propósito
- **Manejo de errores:** try/catch en todas las operaciones asíncronas
