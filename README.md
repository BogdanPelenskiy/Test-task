# TODO Backend (REST API)

Simple TODO REST API (Node.js + Express + Prisma + SQLite + Zod).

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3) Run migrations / create DB
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4) Run the project
Dev:
```bash
npm run dev
```

## Tests
```bash
npm test
```

Healthcheck:
```bash
curl http://localhost:3000/health
```

## API

### Create task
```bash
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/tasks" `
  -ContentType "application/json" `
  -Body '{"title":"My first task","description":"Optional description"}'

```

### List tasks (filters + pagination)
- `status` (optional): `todo | in_progress | done`
- `q` (optional): search by title
- `page` (default 1)
- `limit` (default 10, max 50)

```bash
curl "http://localhost:3000/tasks?page=1&limit=10&status=todo&q=first"
```

Response:
```json
{
  "items": [],
  "page": 1,
  "limit": 10,
  "total": 0
}
```

### Get task by id
```bash
curl http://localhost:3000/tasks/<id>
```

### Update task
```bash
curl -X PATCH http://localhost:3000/tasks/<id>   -H "Content-Type: application/json"   -d '{"status":"done"}'
```

### Delete task
```bash
curl -X DELETE http://localhost:3000/tasks/<id> -i
```

## Error format (centralized)
All errors are returned in a unified JSON format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": []
  }
}
```
