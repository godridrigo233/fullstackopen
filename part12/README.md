# Parte 12: Contenedores

Implementacion de los ejercicios publicados 12.1-12.22 del curso Full Stack Open. La app base Todo proviene del repositorio de envio del curso; `my-app/` adapta el bloglist desarrollado en las partes 4 y 5 para los ejercicios 12.21 y 12.22.

## Ejecutar

Desde la raiz del repositorio:

```bash
# Todo en desarrollo: Vite, API, MongoDB, Redis y Nginx en http://localhost:8080
docker compose -f part12/todo-app/docker-compose.dev.yml up --build

# Todo en produccion: frontend estatico, API, MongoDB, Redis y Nginx
docker compose -f part12/todo-app/docker-compose.yml up --build

# Bloglist propio en desarrollo, con hot reload, en http://localhost:8081
docker compose -f part12/my-app/docker-compose.dev.yml up --build

docker compose -f part12/my-app/docker-compose.yml up --build
# Bloglist propio en produccion en http://localhost:8081
BLOG_SECRET="$(openssl rand -hex 32)" docker compose -f part12/my-app/docker-compose.yml up --build
```

Detener un entorno con `docker compose -f <archivo-compose> down`. Los volumenes de base de datos se conservan; `down -v` los elimina.

## Ejercicios

- 12.1-12.4: comandos y resultados registrados en `script-answers/`.
- 12.5-12.6: Dockerfile y Compose del backend Todo.
- 12.7: rutas GET y PUT para una tarea.
- 12.8: insercion de una tarea con `mongosh`; sesion registrada en `script-answers/`.
- 12.9-12.12: Redis, contador `added_todos`, endpoint `/statistics`, CLI y persistencia.
- 12.13-12.14: frontend Docker con build multietapa; pruebas de `Todo` ejecutadas durante el build.
- 12.15-12.16: Compose y Dockerfiles de desarrollo para frontend y backend.
- 12.17-12.19: Nginx como proxy frontal del stack de desarrollo Todo.
- 12.20: Compose de produccion Todo con MongoDB y Redis persistentes.
- 12.21-12.22: configuraciones de desarrollo y produccion del bloglist en `my-app/`.

## Validacion

```bash
cd part12/todo-app/todo-frontend
npm test
npm run build
```

Los archivos Compose de los dos proyectos se pueden validar desde la raiz con `docker compose -f <archivo-compose> config`.

La pagina oficial en espanol consultada para esta implementacion termina en el ejercicio 12.22; no publica un ejercicio 12.23.
