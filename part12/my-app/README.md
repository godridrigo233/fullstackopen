# Bloglist containers

This is the existing Full Stack Open bloglist application from parts 4 and 5,
configured for exercises 12.21 and 12.22.

Start the development environment with `docker compose -f docker-compose.dev.yml up --build` and open <http://localhost:8081>. Source files are bind-mounted, and only Nginx is published to the host. Create a user through `POST /api/users` before logging in:

```bash
curl -X POST http://localhost:8081/api/users \
  -H 'Content-Type: application/json' \
  -d '{"username":"docker-user","name":"Docker User","password":"change-me"}'
```

Start the production configuration with `BLOG_SECRET="$(openssl rand -hex 32)" docker compose up --build`. It serves the frontend and API through Nginx on port 8081 and persists MongoDB data in a named volume. Compose requires a unique `BLOG_SECRET`.