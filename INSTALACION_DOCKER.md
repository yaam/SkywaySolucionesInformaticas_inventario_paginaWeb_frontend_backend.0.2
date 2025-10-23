# 🐳 Instalación de Docker - Guía Paso a Paso

## 🪟 Windows

### Opción 1: Docker Desktop (Recomendada)

#### Requisitos del Sistema
- Windows 10 64-bit: Pro, Enterprise, o Education (Build 19041 o superior)
- O Windows 11 64-bit
- Procesador con virtualización habilitada (Intel VT-x o AMD-V)
- Mínimo 4GB de RAM (recomendado 8GB)
- WSL 2 habilitado

#### Pasos de Instalación

1. **Habilitar WSL 2**
   
   Abre PowerShell como Administrador y ejecuta:
   ```powershell
   wsl --install
   ```
   
   Si WSL ya está instalado, actualiza a WSL 2:
   ```powershell
   wsl --set-default-version 2
   ```
   
   Reinicia tu computadora si es necesario.

2. **Descargar Docker Desktop**
   
   - Visita: https://www.docker.com/products/docker-desktop
   - Descarga Docker Desktop para Windows
   - Tamaño: ~500MB

3. **Instalar Docker Desktop**
   
   - Ejecuta el instalador descargado
   - Acepta los términos de servicio
   - Mantén seleccionada la opción "Use WSL 2 instead of Hyper-V"
   - Haz clic en "Ok" y espera a que termine la instalación
   - Reinicia tu computadora

4. **Configurar Docker Desktop**
   
   - Abre Docker Desktop desde el menú Inicio
   - Acepta los términos de servicio
   - Opcional: Crea una cuenta de Docker Hub o salta este paso
   - Espera a que Docker Desktop inicie (ícono en la bandeja del sistema)

5. **Verificar la Instalación**
   
   Abre una terminal (CMD o PowerShell) y ejecuta:
   ```bash
   docker --version
   docker-compose --version
   docker ps
   ```
   
   Deberías ver la versión de Docker instalada.

### Opción 2: Chocolatey (Para Usuarios Avanzados)

```powershell
# Abre PowerShell como Administrador
choco install docker-desktop
```

### Configuración Adicional para Windows

#### Habilitar Virtualización en BIOS

Si Docker no inicia, verifica que la virtualización esté habilitada:

1. Reinicia tu PC
2. Entra al BIOS/UEFI (generalmente F2, F12, Del o Esc)
3. Busca opciones de virtualización:
   - Intel: "Intel VT-x" o "Virtualization Technology"
   - AMD: "AMD-V" o "SVM Mode"
4. Habilita la opción
5. Guarda y reinicia

#### Configurar Recursos en Docker Desktop

1. Abre Docker Desktop
2. Ve a Settings (ícono de engranaje)
3. Resources:
   - **CPUs**: Asigna al menos 2 CPUs
   - **Memory**: Asigna al menos 4GB
   - **Swap**: 1GB
   - **Disk image size**: 60GB

## 🐧 Linux (Ubuntu/Debian)

### Instalación Oficial

```bash
# 1. Actualizar paquetes
sudo apt-get update

# 2. Instalar dependencias
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 3. Agregar la clave GPG oficial de Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. Configurar el repositorio
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. Instalar Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 6. Verificar instalación
sudo docker --version
sudo docker compose version

# 7. Habilitar Docker para iniciar con el sistema
sudo systemctl enable docker
sudo systemctl start docker
```

### Agregar tu Usuario al Grupo Docker

```bash
# Evita usar sudo en cada comando
sudo usermod -aG docker $USER

# Aplicar cambios (cierra sesión y vuelve a entrar, o ejecuta):
newgrp docker

# Verificar
docker ps
```

## 🍎 macOS

### Opción 1: Docker Desktop (Recomendada)

1. **Requisitos**
   - macOS 11 o superior
   - Chip Apple Silicon (M1/M2) o Intel
   - Mínimo 4GB de RAM

2. **Descargar e Instalar**
   
   - Visita: https://www.docker.com/products/docker-desktop
   - Descarga Docker Desktop para Mac
   - Chip Apple Silicon: Descarga la versión "Apple Chip"
   - Chip Intel: Descarga la versión "Intel Chip"
   - Arrastra Docker.app a la carpeta Applications
   - Abre Docker desde Applications

3. **Configurar**
   
   - Acepta los términos
   - Otorga permisos de sistema si es necesario
   - Espera a que Docker inicie

4. **Verificar**
   
   ```bash
   docker --version
   docker compose version
   docker ps
   ```

### Opción 2: Homebrew

```bash
# Instalar Homebrew si no lo tienes
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Docker Desktop
brew install --cask docker

# Abrir Docker Desktop
open /Applications/Docker.app
```

## ✅ Verificación Post-Instalación

### 1. Verificar Versiones

```bash
docker --version
# Esperado: Docker version 24.x.x o superior

docker compose version
# Esperado: Docker Compose version v2.x.x o superior
```

### 2. Ejecutar Contenedor de Prueba

```bash
docker run hello-world
```

Si ves un mensaje de "Hello from Docker!", la instalación fue exitosa.

### 3. Verificar Docker Compose

```bash
docker compose version
```

## 🔧 Configuración Recomendada

### Docker Desktop Settings

1. **General**
   - ✅ Start Docker Desktop when you log in
   - ✅ Use Docker Compose V2

2. **Resources**
   - CPUs: 2-4 (dependiendo de tu sistema)
   - Memory: 4GB mínimo, 8GB recomendado
   - Swap: 1GB
   - Disk: 60GB

3. **Docker Engine**
   
   Configuración básica (archivo daemon.json):
   ```json
   {
     "builder": {
       "gc": {
         "defaultKeepStorage": "20GB",
         "enabled": true
       }
     },
     "experimental": false,
     "features": {
       "buildkit": true
     }
   }
   ```

## 🐛 Solución de Problemas

### Windows

#### Error: "WSL 2 installation is incomplete"

```powershell
# Ejecutar como Administrador
wsl --update
wsl --set-default-version 2
```

#### Error: "Virtualization is not enabled"

- Habilita la virtualización en el BIOS (ver sección anterior)

#### Docker Desktop no inicia

1. Cierra Docker Desktop completamente
2. Abre PowerShell como Administrador:
   ```powershell
   wsl --shutdown
   ```
3. Reinicia Docker Desktop

### Linux

#### Error: "Cannot connect to Docker daemon"

```bash
# Iniciar el servicio Docker
sudo systemctl start docker

# Verificar estado
sudo systemctl status docker
```

#### Error de permisos

```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Cerrar sesión y volver a entrar
```

### macOS

#### Docker Desktop no abre

1. Desinstala Docker Desktop
2. Elimina archivos residuales:
   ```bash
   rm -rf ~/Library/Group\ Containers/group.com.docker
   rm -rf ~/Library/Containers/com.docker.docker
   ```
3. Reinstala Docker Desktop

## 📝 Próximos Pasos

Una vez instalado Docker:

1. ✅ Verifica la instalación con `docker --version`
2. ✅ Crea el archivo `.env` desde `env.docker.example`
3. ✅ Ejecuta `inicio-rapido.bat` (Windows) o `./inicio-rapido.sh` (Linux/Mac)
4. ✅ Sigue la guía en [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)

## 🔗 Recursos Adicionales

- [Documentación oficial de Docker](https://docs.docker.com/)
- [Docker Desktop Manual](https://docs.docker.com/desktop/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)

## 🆘 Soporte

Si tienes problemas con la instalación:

1. Verifica los requisitos del sistema
2. Consulta la [documentación oficial](https://docs.docker.com/get-docker/)
3. Busca en [Docker Forums](https://forums.docker.com/)
4. Revisa [Stack Overflow](https://stackoverflow.com/questions/tagged/docker)

---

**Nota**: Una vez completada la instalación, regresa a [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) para continuar con la dockerización del proyecto Skyway.

