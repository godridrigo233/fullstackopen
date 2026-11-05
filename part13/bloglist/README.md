# Bloglist relacional

Backend compatible con el frontend de la Parte 5, ahora respaldado por PostgreSQL y Sequelize. El backend aplica las migraciones al iniciar.

Desde la raiz del repositorio:

```bash
docker compose -f part13/docker-compose.yml up --build -d
```

Abre <http://localhost:8082>. PostgreSQL queda disponible en `localhost:5433`; Nginx publica el frontend y el API. Para crear un usuario antes de iniciar sesion:

```bash
curl -X POST http://localhost:8082/api/users \
  -H 'Content-Type: application/json' \
  -d '{"username":"reader@example.com","name":"Reader","password":"change-me"}'
```

## SQL inicial y CLI

`commands.sql` conserva el DDL y los datos de ejemplo del ejercicio 13.2. Ejecutalo en una base separada del esquema administrado por migraciones:

```bash
docker compose -f part13/docker-compose.yml exec postgres createdb -U postgres bloglist_exercise
docker compose -f part13/docker-compose.yml exec -T postgres psql -U postgres -d bloglist_exercise < part13/bloglist/commands.sql
docker compose -f part13/docker-compose.yml exec -e DATABASE_URL=postgres://postgres:postgres@postgres:5432/bloglist_exercise backend node cli.js
```

La aplicacion principal usa migraciones Umzug en `backend/migrations/`; evita ejecutar el DDL inicial directamente sobre esa base.

## Pruebas

```bash
docker compose -f part13/docker-compose.yml up -d postgres
cd part13/bloglist/backend
npm test
```

La base de pruebas `bloglist_test` se crea al inicializar el volumen de PostgreSQL. Para iniciar todo el stack de nuevo, ejecuta `docker compose -f part13/docker-compose.yml up --build -d` desde la raiz.

## Despliegue

La aplicacion lee `DATABASE_URL`, `JWT_SECRET` y `PORT`; en un proveedor con PostgreSQL configura esas variables y ejecuta `npm start` desde `bloglist/backend`. La creacion de la app y la base de Heroku del ejercicio 13.1 requiere acceso a una cuenta del proveedor y debe completarse ahi.