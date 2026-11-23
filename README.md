# Issue Tracker

A full-stack lightweight issue tracker built with React, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- Create issues with title, description, status, and assignee email
- View all issues in a compact list
- Filter by status and assignee
- Search issue title, description, and assignee
- Edit description, status, and assignee
- Backend layering: controller -> service -> repository -> Mongoose model

## API

- `GET http://localhost:5000/api/issues`
- `GET http://localhost:5000/api/issues?status=Open&assignee=user@example.com`
- `GET http://localhost:5000/api/issues/<issue-id>`
- `POST http://localhost:5000/api/issues`
- `PATCH http://localhost:5000/api/issues/<issue-id>`
- `PUT http://localhost:5000/api/issues/<issue-id>`
- `GET http://localhost:5000/api/health`

## Setup

1. Create `backend/.env` from `backend/.env.example` and set your MongoDB connection URI.
2. Install dependencies:

```bash
npm run install:all
```

3. Ensure MongoDB is running, then create the collection indexes:

```bash
npm run db:migrate --prefix backend
```

4. Start the API:

```bash
npm run dev:api
```

5. Start the frontend:

```bash
npm run dev:web
```

Open `http://localhost:5173`.
