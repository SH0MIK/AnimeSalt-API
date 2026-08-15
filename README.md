<div align="center">

<img src="public/AnimeSalt.png" width="96" alt="Renime API" />

# Renime API

### Hindi anime. One REST surface. Two providers.

**The API layer people actually ship with** — home feeds, search, details, seasons, embeds.  
Built for apps that need **Hindi / regional anime & cartoon** catalogs without babysitting scrapers.

[![Node](https://img.shields.io/badge/Node.js-≥18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)
[![Team](https://img.shields.io/badge/Dark%20%26%20Pyro-Team-a78bfa?style=for-the-badge)](#)

**Docs** · **Health** · **Providers**

</div>

---

> **Educational & research use only.** Respect copyright law and site terms.  
> Renime does **not** host video. You scrape public HTML — you own compliance.

---

## Why Renime hits different

| | |
|---|---|
| **Hindi-first catalogs** | Built around AnimeSalt + WatchAnimeWorld — the stacks people use for Hindi / Tamil / Telugu anime & cartoons |
| **One param, two worlds** | `?provider=animesalt` or `?provider=watchanimeworld` — same routes, same JSON shape |
| **Ship-ready routes** | Home · search · info · episodes · embed · category · A–Z |
| **Not a toy** | Helmet, CORS gate, compression, retries, clean error pages, liquid-glass docs |
| **Zero drama** | Clone → `npm i` → `npm run dev` → JSON |

---

## Providers

| ID | Site | Aliases |
|----|------|---------|
| `animesalt` **(default)** | [animesalt.link](https://animesalt.link) | `salt`, `as` |
| `watchanimeworld` | [watchanimeworld.top](https://watchanimeworld.top) | `waw`, `animeworld`, `awi` |

```http
GET /api/home?provider=watchanimeworld
GET /api/search?q=naruto&provider=animesalt
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

| | |
|---|---|
| API | `http://localhost:3000/api` |
| Landing | `http://localhost:3000/` |
| Docs | `http://localhost:3000/docs.html` |

```bash
curl "http://localhost:3000/api/health"
curl "http://localhost:3000/api/home?provider=animesalt"
curl "http://localhost:3000/api/search?q=demon%20slayer"
curl "http://localhost:3000/api/info/spy-x-family"
```

---

## Endpoints

All routes under **`/api`**. Optional query: **`provider`**.

| Method | Path | What you get |
|--------|------|----------------|
| `GET` | `/health` | Status + uptime + providers |
| `GET` | `/providers` | Provider list |
| `GET` | `/home` | Drops, arrivals, movies, rankings |
| `GET` | `/search?q=` | Full search + images |
| `GET` | `/search?suggestion=` | Fast title suggestions |
| `GET` | `/info/:id` | Series / movie details |
| `GET` | `/episodes/:id/:season` | Season episode list |
| `GET` | `/embed/:id` | Player / embed payload |
| `GET` | `/category/*` | Movies, genres, languages, networks… |
| `GET` | `/letter/:letter` | A–Z browse |

### Category examples

```http
GET /api/category/movies
GET /api/category/genre/sci-fi?page=2
GET /api/category/language/hindi
GET /api/letter/N
```

---

## Config

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

| Variable | Role |
|----------|------|
| `PORT` | Server port |
| `NODE_ENV` | `development` / `production` |
| `CORS_ORIGIN` | `*` or comma-separated origins (else **403**) |

---

## Stack

```
Node ≥ 18  ·  Express  ·  Cheerio  ·  Axios  ·  Zod
Helmet  ·  CORS  ·  Compression
```

```
Renime-API/
├── public/          # Liquid-glass UI + docs
├── src/
│   ├── config/      # Providers + env
│   ├── extractors/  # Scrapers
│   ├── controllers/
│   ├── routes/
│   └── middleware/
└── server.js
```

---

## Screenshots

<p align="center">
  <img src="public/home.jpg" width="80%" alt="Renime preview" />
</p>

---

## Team

**Dark & Pyro Team**

No random contributor noise. This project is credited to **Dark & Pyro Team**.

---

## License

**ISC** · Copyright © 2025 **Dark & Pyro Team**

### Disclaimer

Renime API is provided for **educational and research purposes only**.  
You are responsible for compliance with copyright law and third-party terms.  
The authors do **not** endorse piracy. All media remains property of its rights holders.

---

<div align="center">

**Stop wiring broken scrapers.**  
**Start shipping Renime.**

`npm run dev` → open `/docs.html` → build.

</div>
