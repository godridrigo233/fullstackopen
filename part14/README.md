# Parte 14: Next.js

Solución de los ejercicios 1–24 de los capítulos 2–4 del curso [Full Stack Open: Next.js](https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-nextjs). El capítulo 1 no forma parte de esta solución.

La aplicación de blogs evoluciona desde rutas y Server Actions hasta PostgreSQL con Drizzle, autenticación, validaciones, listas de lectura y una API protegida por token. El ejercicio 7 requiere una cuenta de Vercel y un repositorio remoto; el despliegue debe completarse con las credenciales propias.

## Requisitos

- Node.js y npm
- PostgreSQL (local o una base Neon)

## Configuración

Desde esta carpeta:

```bash
cp .env.example .env.local
```

Completa `DATABASE_URL`, `NEXTAUTH_SECRET` y `NEXTAUTH_URL` en `.env.local`. No subas ese archivo al repositorio.

Aplica las migraciones y arranca el servidor:

```bash
npm install
npm run db:migrate
npm run dev
```

La aplicación estará disponible en <http://localhost:3000>. Para una cuenta local, usa `/register`; las rutas `/api/testing/*` permiten preparar datos de prueba únicamente fuera de producción.

## Ejercicios implementados

- **Capítulo 2 (1–6):** navegación, listado y detalle de blogs, creación y likes mediante Server Actions, orden descendente por likes y búsqueda con parámetros de URL.
- **Capítulo 3 (7–10):** persistencia PostgreSQL con Drizzle, relaciones entre blogs y usuarios, páginas de usuarios con sus blogs y preparación para despliegue en Vercel.
- **Capítulo 4 (11–24):** login, registro y validaciones, notificaciones con Context, diseño responsive, perfil privado, generación y uso de token API, listas de lectura con estados leído/no leído, homepage estática desde MDX y endpoints de preparación de pruebas.

## Base de datos

El esquema está en `lib/db/schema.ts` y las migraciones versionadas están en `drizzle/`. Para generar una migración después de cambiar el esquema:

```bash
npm run db:generate
npm run db:migrate
```

## Pruebas del ejercicio 24

El curso publica las pruebas de navegador en [fullstack-hy2020/next-js-tests](https://github.com/fullstack-hy2020/next-js-tests); el directorio `tests/` ya está incluido aquí. Configura una base de datos de prueba independiente en `.env.local`. El runner Playwright y los scripts `test:e2e` y `test:e2e:ui` ya están configurados; instala los navegadores con `npx playwright install` y ejecuta `npm run test:e2e`. El endpoint de reset elimina todos los datos y debe apuntar únicamente a esa base de pruebas.

El workflow [part14-playwright.yml](../.github/workflows/part14-playwright.yml) ejecuta las mismas pruebas en GitHub Actions con una base PostgreSQL temporal; no requiere configurar secrets para CI. El endpoint de reset elimina todos los datos de esa base efímera.

## Comprobaciones locales

```bash
npm run lint
npm run build
```
