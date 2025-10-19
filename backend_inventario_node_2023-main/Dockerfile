#que version de node sera instalada en la imagen
#instala node en el contenedor
FROM node:16

#crea un directorio dentro del contenedor 
#crea una ruta de un sistema operativo linux
#copia todo el codigo dentro todo el contenedor

WORKDIR /usr/src/app

#copia el package.json del codigo 

COPY package*.json ./

RUN npm install

#copia todo el contenido del codigo 
COPY . .

#consume los contenidos del contener sobre un puerto de escucha
#escucha toda las peticiones http
EXPOSE 4000
CMD [ "node", "index.js" ]