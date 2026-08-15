# AnimeSalt API

**Multi-provider REST scraper** for [AnimeSalt](https://animesalt.link) and [WatchAnimeWorld](https://watchanimeworld.top).

Built by **Dark & Pyro Team**.

> Educational & research use only. Respect copyright laws and site terms. This project does not host or stream media.

---

## Features

| Area | Capability |
|------|------------|
| Providers | `animesalt` (default) · `watchanimeworld` |
| Catalog | Home, category, letter (A–Z), search |
| Title | Details, season episodes, embed players |
| Ops | Health check, provider list, CORS gate, retries |
| UI | Liquid-glass landing, docs, 403/404 pages |

---

## Quick start

```bash
git clone https://github.com/itzzzdark/AnimeSalt-API.git
cd AnimeSalt-API
npm install
cp .env.example .env
npm run dev
```

| Mode | Command |
|------|---------|
| Development | `npm run dev` |
| Production | `npm start` |

API base: `http://localhost:3000/api`  
Docs UI: `http://localhost:3000/docs.html`

---

## Configuration

`.env`:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default `3000`) |
| `NODE_ENV` | `development` or `production` |
| `CORS_ORIGIN` | `*` or comma-separated allowed origins |

When `CORS_ORIGIN` is not `*`, requests need a matching `Origin` / `Referer` or they receive **403**.

---

## Providers

| ID | Base URL | Aliases |
|----|----------|---------|
| `animesalt` | https://animesalt.link | `salt`, `as` |
| `watchanimeworld` | https://watchanimeworld.top | `waw`, `animeworld`, `awi` |

Pass on any scrape route:

```http
GET /api/home?provider=watchanimeworld
GET /api/search?q=naruto&provider=waw
```

```http
GET /api/providers
```

---

## Endpoints

All routes are prefixed with `/api`.

### Meta

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Status, uptime, provider list |
| `GET` | `/providers` | Supported providers |

### Catalog

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/home` | Newest drops, arrivals, movies, rankings |
| `GET` | `/search?q=` | Full search (with images) |
| `GET` | `/search?suggestion=` | Fast title suggestions |
| `GET` | `/category/*` | Movies, series, genre, language, network, franchise |
| `GET` | `/letter/:letter` | Alphabetical browse |

### Title

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/info/:id` | Series / movie details |
| `GET` | `/episodes/:id/:season` | Episodes for a season |
| `GET` | `/embed/:id` | Player / embed payload |

### Examples

```bash
curl "http://localhost:3000/api/health"
curl "http://localhost:3000/api/home?provider=animesalt"
curl "http://localhost:3000/api/search?q=naruto"
curl "http://localhost:3000/api/info/spy-x-family"
curl "http://localhost:3000/api/episodes/spy-x-family/1"
curl "http://localhost:3000/api/category/movies?page=1"
curl "http://localhost:3000/api/category/genre/sci-fi"
curl "http://localhost:3000/api/letter/N"
```

---

## Response shape

Successful handlers typically return JSON with scraped fields (and often a success envelope from middleware). Errors use standard HTTP status codes:

| Code | Meaning |
|------|---------|
| `400` | Validation / bad input |
| `403` | Origin not allowed |
| `404` | Route or resource missing |
| `500` | Upstream or internal failure |

---

## Project structure

```
AnimeSalt-API/
├── public/           # Landing, docs, 403, 404 (liquid glass UI)
├── src/
│   ├── base/         # Provider-aware base URL
│   ├── config/       # Env + providers
│   ├── controllers/
│   ├── extractors/   # Cheerio scrapers
│   ├── middleware/
│   ├── routes/
│   └── utils/
├── server.js
└── package.json
```

---

## Stack

- Node.js ≥ 18 · Express
- Cheerio · Axios · Zod
- Helmet · CORS · Compression

---

## License & credit

ISC · **Copyright © 2025 Dark & Pyro Team**

No third-party GitHub contributors are attributed in this fork. Credit belongs to **Dark & Pyro Team**.

### Disclaimer

This software is provided for educational and research purposes only. Users are responsible for compliance with copyright law and terms of service. The authors do not endorse piracy. All media remains the property of its respective rights holders.
