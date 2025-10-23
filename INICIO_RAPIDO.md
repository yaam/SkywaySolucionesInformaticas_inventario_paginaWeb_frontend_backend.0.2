# 🚀 Inicio Rápido - Docker

## ⚡ En 3 Pasos

### 1️⃣ Configurar Variables de Entorno

```bash
# Windows
copy env.docker.example .env

# Linux/Mac
cp env.docker.example .env
```

Edita el archivo `.env` con tus configuraciones:
- `MONGO_URI`: Tu connection string de MongoDB Atlas
- `EMAIL_USER`: Tu email de Outlook
- `EMAIL_PASS`: Tu contraseña de aplicación de Outlook

### 2️⃣ Ejecutar el Script de Inicio

**Windows:**
```bash
inicio-rapido.bat
```

**Linux/Mac:**
```bash
chmod +x inicio-rapido.sh
./inicio-rapido.sh
```

O usando Make (recomendado):
```bash
# Desarrollo
make dev

# Producción
make prod
```

### 3️⃣ Acceder a la Aplicación

- **Frontend**: http://localhost (producción) o http://localhost:3000 (desarrollo)
- **Backend**: http://localhost:4001

## 📝 Comandos Rápidos

### Desarrollo (con hot-reload)
```bash
docker-compose -f docker-compose.dev.yml up
```

### Producción
```bash
docker-compose up -d
```

### Ver Logs
```bash
docker-compose logs -f
```

### Detener Todo
```bash
docker-compose down
```

## 🔧 Usando Make (Recomendado)

```bash
make help          # Ver todos los comandos disponibles
make dev           # Desarrollo
make prod          # Producción
make logs          # Ver logs
make down          # Detener
make clean         # Limpiar todo
```

## 🆘 Problemas Comunes

### Error: "Port already in use"
```bash
# Cambiar puertos en docker-compose.yml
ports:
  - "8080:80"    # Frontend
  - "4002:4001"  # Backend
```

### Error: "Cannot connect to MongoDB"
- Verifica tu `MONGO_URI` en el archivo `.env`
- Si usas MongoDB Atlas, asegúrate de que tu IP esté en la whitelist

### Docker no está corriendo
- Inicia Docker Desktop en Windows/Mac
- O inicia el servicio Docker en Linux: `sudo systemctl start docker`

## 📚 Documentación Completa

Para más detalles, consulta:
- [INSTRUCCIONES_DOCKER.md](./INSTRUCCIONES_DOCKER.md) - Documentación completa
- [Makefile](./Makefile) - Todos los comandos disponibles

## 🎯 Diferencias entre Desarrollo y Producción

| Característica | Desarrollo | Producción |
|---------------|------------|------------|
| Hot-reload | ✅ Sí | ❌ No |
| Puerto Frontend | 3000 | 80 |
| Optimización | ❌ No | ✅ Sí |
| Servidor Frontend | React Dev Server | Nginx |
| Tamaño | Grande | Pequeño |

## ✅ Verificación

Para verificar que todo funciona:

1. **Backend**: `curl http://localhost:4001`
2. **Frontend**: Abre http://localhost en tu navegador
3. **Logs**: `docker-compose logs -f`
4. **Estado**: `docker-compose ps`

---

¿Necesitas ayuda? Revisa [INSTRUCCIONES_DOCKER.md](./INSTRUCCIONES_DOCKER.md)


