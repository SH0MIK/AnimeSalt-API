<div align="center">

<img src="public/AnimeSalt.png" width="100" alt="Renime API" />

# Renime API

### Hindi anime infrastructure, not another half-broken scraper.

Multi-provider REST API for **AnimeSalt** + **WatchAnimeWorld**.  
Home · search · details · seasons · embeds · categories — **one JSON contract**.

[![Node](https://img.shields.io/badge/Node.js-≥18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-black?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-ISC-3b82f6?style=for-the-badge)](LICENSE)
[![Team](https://img.shields.io/badge/Dark%20%26%20Pyro-Team-a78bfa?style=for-the-badge)](#credit)

**[Full API docs → `docs.md`](docs.md)** · **Live UI → `/docs.html`**

</div>

---

> **Educational & research use only.** Renime does not host video.  
> You are responsible for copyright compliance and site terms.

---

## Why Renime

| Pillar | What you get |
|--------|----------------|
| **Hindi-first** | Wired for the catalogs people actually use for Hindi / Tamil / Telugu anime & cartoons |
| **Multi-provider** | `animesalt` + `watchanimeworld` behind the same routes |
| **Stable surface** | Predictable JSON for clients, bots, and internal tools |
| **Production habits** | Helmet, CORS gate, compression, HTTP retries, 403/404 pages |
| **Docs that ship** | `docs.md` + liquid-glass `/docs.html` |

---

## Providers

| ID | Base URL | Aliases |
|----|----------|---------|
| `animesalt` *(default)* | `https://animesalt.link` | `salt`, `as` |
| `watchanimeworld` | `https://watchanimeworld.top` | `waw`, `animeworld`, `awi` |

```http
GET /api/home?provider=watchanimeworld
GET /api/search?q=naruto&provider=animesalt
```

```http
GET /api/providers
```

---

## Quick start

```bash
git clone https://github.com/itzzzdark/Renime-API.git
cd Renime-API
npm install
cp .env.example .env
npm run dev
```

| Surface | URL |
|---------|-----|
| API | `http://localhost:3000/api` |
| Landing | `http://localhost:3000/` |
| Docs UI | `http://localhost:3000/docs.html` |

```bash
curl -s "http://localhost:3000/api/health" | jq
curl -s "http://localhost:3000/api/home?provider=animesalt" | jq '.data.newestDrops[0]'
curl -s "http://localhost:3000/api/search?q=demon%20slayer" | jq
```

---

## Endpoint map

All routes are under **`/api`**. Optional global query: **`provider`**.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health + providers |
| `GET` | `/providers` | Provider registry |
| `GET` | `/home` | Home catalog sections |
| `GET` | `/search` | Search (`q` or `suggestion`) |
| `GET` | `/info/:id` | Title details |
| `GET` | `/episodes/:id/:season` | Season episodes |
| `GET` | `/embed/:id` | Episode servers / embeds |
| `GET` | `/category/*` | Category / filter browse |
| `GET` | `/letter/:letter` | A–Z index |

Deep request/response examples → **[`docs.md`](docs.md)**.

---

## Configuration

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default `3000`) |
| `NODE_ENV` | `development` \| `production` |
| `CORS_ORIGIN` | `*` or comma-separated origins. Non-matching clients get **403**. |

---

## Architecture

```
Renime-API/
├── public/                 # Landing, docs UI, 403, 404
├── src/
│   ├── base/               # Provider-aware base URL
│   ├── config/             # env + providers + user-agents
│   ├── controllers/        # HTTP layer
│   ├── extractors/         # Cheerio scrapers
│   ├── middleware/         # CORS gate, errors, validation
│   ├── routes/
│   └── utils/              # http client, response helpers
├── server.js
├── docs.md                 # Full API reference
└── package.json
```

**Stack:** Node ≥ 18 · Express · Cheerio · Axios · Zod · Helmet · CORS · Compression

---

## Response conventions

Successful **home / health / providers** calls use:

```json
{
  "success": true,
  "data": {},
  "message": null,
  "timestamp": "2026-08-15T12:00:00.000Z"
}
```

**info / episodes / embed / search / category / letter** often return the payload object directly (see `docs.md`).

Errors:

```json
{
  "success": false,
  "error": "Failed to extract home page data",
  "message": null,
  "timestamp": "2026-08-15T12:00:00.000Z"
}
```

| Status | Meaning |
|--------|---------|
| `400` | Validation / bad input |
| `403` | Origin blocked |
| `404` | Unknown route |
| `500` | Upstream or internal failure |

---

## Credit

**Dark & Pyro Team**

This project is attributed to **Dark & Pyro Team** only.

---

## License

**ISC** · Copyright © 2025 **Dark & Pyro Team**

### Disclaimer

Provided for **educational and research purposes only**.  
Do not use this software to infringe copyright. The authors do not endorse piracy.  
All media remains the property of its respective rights holders.

---

<div align="center">

**Build on Renime. Ship faster.**

Read [`docs.md`](docs.md) · open `/docs.html` · `npm run dev`

</div>
