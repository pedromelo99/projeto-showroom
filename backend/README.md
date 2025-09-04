# Showroom Backend

API em Node.js (Express) com Sequelize e SQLite por padrão.

## Requisitos
- Node 18+

## Configuração
Crie um arquivo `.env` na pasta `backend`:

```
PORT=4000
JWT_SECRET=please-change-me
NODE_ENV=development
DATABASE_URL=sqlite:./data/showroom.sqlite
UPLOADS_DIR=./uploads
# Opcional (seed admin)
ADMIN_EMAIL=admin@showroom.local
ADMIN_NAME=Admin
ADMIN_PASSWORD=changeme
```

## Instalação e execução
```
cd backend
npm install
npm run db:sync
npm run seed:admin # opcional
npm run dev
```
A API ficará em `http://localhost:4000`.

## Rotas
- Auth
  - POST /api/auth/register
  - POST /api/auth/login
  - GET  /api/auth/me (Auth)
- Carros
  - GET    /api/cars
  - GET    /api/cars/:id
  - POST   /api/cars (Admin)
  - PUT    /api/cars/:id (Admin)
  - DELETE /api/cars/:id (Admin)
  - POST   /api/cars/:id/images (Admin, multipart: images[])
- Leads
  - POST /api/leads

## Notas
- Trocar SQLite por Postgres: ajuste `DATABASE_URL` (ex: `postgres://user:pass@host:5432/db`).
- Uploads estáticos são servidos em `/uploads`.

## Desenvolvimento
- Logs HTTP via morgan.
- Estrutura modular para facilitar testes e refatorações.
