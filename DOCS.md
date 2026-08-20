# Renime API — Full Documentation

> **Version:** 1.1.0  
> **Base URL (local):** `http://localhost:3000`  
> **API prefix:** `/api`  
> **Team:** Dark & Pyro Team  
> **Scope:** Educational & research use only

This document covers **every public endpoint**, query/path parameters, example requests, and **example JSON responses**.

---

## Table of contents

1. [Global rules](#1-global-rules)
2. [Authentication & CORS](#2-authentication--cors)
3. [Providers](#3-providers)
4. [GET /api/health](#4-get-apihealth)
5. [GET /api/providers](#5-get-apiproviders)
6. [GET /api/home](#6-get-apihome)
7. [GET /api/search](#7-get-apisearch)
8. [GET /api/info/:id](#8-get-apiinfoid)
9. [GET /api/episodes/:id/:season](#9-get-apiepisodesidseason)
10. [GET /api/embed/:id](#10-get-apiembedid)
11. [GET /api/category/*](#11-get-apicategory)
12. [GET /api/letter/:letter](#12-get-apiletterletter)
13. [GET /api/scrape](#13-get-apiscrape)
14. [Error responses](#14-error-responses)
15. [Client integration notes](#15-client-integration-notes)

---

## 1. Global rules

| Rule | Detail |
|------|--------|
| Protocol | HTTP/HTTPS |
| Format | JSON (`Content-Type: application/json`) |
| Methods | **GET only** for all documented routes |
| Prefix | Every API route starts with `/api` |
| Provider | Optional query `provider` on scrape routes |
| Encoding | UTF-8; URL-encode query values |

### Global query parameter

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `provider` | string | no | `animesalt` | Upstream source id or alias |

**Accepted values / aliases**

| Canonical ID | Aliases |
|--------------|---------|
| `animesalt` | `salt`, `as` |
| `watchanimeworld` | `waw`, `animeworld`, `awi` |

Unknown values fall back to the default provider (`animesalt`).

---

## 2. Authentication & CORS

Renime does **not** use API keys.

Access is controlled with `CORS_ORIGIN` in `.env`:

```env
CORS_ORIGIN=*
# or
CORS_ORIGIN=https://app.example.com,https://admin.example.com
```

| Setting | Behavior |
|---------|----------|
| `*` | Any origin allowed |
| Explicit list | Request `Origin` or `Referer` must match; otherwise **403** HTML page |

Recommended client headers:

```http
Accept: application/json
Origin: https://your-frontend.example
```

---

## 3. Providers

Upstream sites share a similar WordPress / Torofilm-style UI, so extractors are shared.

| ID | Site | Role |
|----|------|------|
| `animesalt` | https://animesalt.link | Default |
| `watchanimeworld` | https://watchanimeworld.top | Alternate mirror / catalog |

List at runtime:

```http
GET /api/providers
```

---

## 4. GET `/api/health`

Liveness + basic metadata.

### Request

```http
GET /api/health HTTP/1.1
Host: localhost:3000
Accept: application/json
```

```bash
curl -s "http://localhost:3000/api/health"
```

### Response `200`

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-08-15T12:00:00.000Z",
    "uptime": 3842.12,
    "defaultProvider": "animesalt",
    "providers": [
      {
        "id": "animesalt",
        "name": "AnimeSalt",
        "baseUrl": "https://animesalt.link"
      },
      {
        "id": "watchanimeworld",
        "name": "WatchAnimeWorld",
        "baseUrl": "https://watchanimeworld.top"
      }
    ]
  },
  "message": "Service is healthy",
  "timestamp": "2026-08-15T12:00:00.000Z"
}
```

---

## 5. GET `/api/providers`

Provider registry for clients and UI switchers.

### Request

```http
GET /api/providers HTTP/1.1
Host: localhost:3000
```

```bash
curl -s "http://localhost:3000/api/providers"
```

### Response `200`

```json
{
  "success": true,
  "data": {
    "default": "animesalt",
    "providers": [
      {
        "id": "animesalt",
        "name": "AnimeSalt",
        "baseUrl": "https://animesalt.link"
      },
      {
        "id": "watchanimeworld",
        "name": "WatchAnimeWorld",
        "baseUrl": "https://watchanimeworld.top"
      }
    ]
  },
  "message": "Available scrape providers",
  "timestamp": "2026-08-15T12:00:00.000Z"
}
```

---

## 6. GET `/api/home`

Home page sections: newest drops, arrivals, movies, cartoons, rankings.

### Parameters

| Name | In | Required | Description |
|------|----|----------|-------------|
| `provider` | query | no | Upstream provider |

### Request

```http
GET /api/home?provider=animesalt HTTP/1.1
Host: localhost:3000
Accept: application/json
```

```bash
curl -s "http://localhost:3000/api/home?provider=animesalt"
curl -s "http://localhost:3000/api/home?provider=watchanimeworld"
```

### Response `200`

```json
{
  "success": true,
  "data": {
    "newestDrops": [
      {
        "id": "yowayowa-sensei",
        "type": "series",
        "title": "Yowayowa Sensei",
        "image": "https://image.tmdb.org/t/p/w500/example.jpg",
        "season": "Season 1",
        "episodes": "EP:12-13"
      }
    ],
    "newAnimeArrivals": [
      {
        "id": "spy-x-family",
        "type": "series",
        "title": "Spy x Family",
        "image": "https://image.tmdb.org/t/p/w500/example.jpg"
      }
    ],
    "cartoonSeries": [
      {
        "id": "ben-10",
        "type": "series",
        "title": "Ben 10",
        "image": "https://example.cdn/poster.jpg"
      }
    ],
    "animeMovies": [
      {
        "id": "your-name",
        "type": "movie",
        "title": "Your Name.",
        "image": "https://image.tmdb.org/t/p/w500/example.jpg"
      }
    ],
    "cartoonFilms": [
      {
        "id": "elemental",
        "type": "movie",
        "title": "Elemental",
        "image": "https://example.cdn/poster.jpg"
      }
    ],
    "mostWatchedShows": [
      {
        "id": "naruto-shippuden",
        "type": "series",
        "title": "Naruto Shippuden",
        "image": "https://image.tmdb.org/t/p/w500/example.jpg",
        "rank": 1
      }
    ],
    "mostWatchedFilms": [
      {
        "id": "demon-slayer-mugen-train",
        "type": "movie",
        "title": "Demon Slayer: Mugen Train",
        "image": "https://image.tmdb.org/t/p/w500/example.jpg",
        "rank": 1
      }
    ]
  },
  "timestamp": "2026-08-15T12:00:00.000Z"
}
```

### Field notes

| Field | Notes |
|-------|-------|
| `id` | Slug used in `/api/info/:id`, `/api/episodes/:id/:season` |
| `type` | `series` \| `movie` \| `unknown` |
| `season` / `episodes` | Present mainly on `newestDrops` |

---

## 7. GET `/api/search`

Either **`q`** (full search) or **`suggestion`** (fast AJAX-style titles) is required.

### Parameters

| Name | In | Required | Description |
|------|----|----------|-------------|
| `q` | query | one of | Full search (includes images) |
| `suggestion` | query | one of | Lightweight title suggestions |
| `provider` | query | no | Upstream provider |

### Request — full search

```http
GET /api/search?q=naruto&provider=animesalt HTTP/1.1
Host: localhost:3000
```

```bash
curl -s "http://localhost:3000/api/search?q=naruto&provider=animesalt"
```

### Response `200` (full search)

Shape is returned directly from the search controller (array or object of items depending on extractor path). Typical item:

```json
{
  "items": [
    {
      "id": "naruto",
      "type": "series",
      "title": "Naruto",
      "image": "https://image.tmdb.org/t/p/w500/example.jpg"
    },
    {
      "id": "naruto-shippuden",
      "type": "series",
      "title": "Naruto Shippuden",
      "image": "https://image.tmdb.org/t/p/w500/example2.jpg"
    }
  ]
}
```

### Request — suggestions

```bash
curl -s "http://localhost:3000/api/search?suggestion=naru"
```

### Response `200` (suggestions)

```json
{
  "items": [
    {
      "id": "naruto",
      "type": "series",
      "title": "Naruto"
    },
    {
      "id": "naruto-shippuden",
      "type": "series",
      "title": "Naruto Shippuden"
    }
  ]
}
```

### Error `400`

Missing both `q` and `suggestion`:

```json
{
  "success": false,
  "error": "Either \"suggestion\" or \"q\" parameter is required",
  "timestamp": "2026-08-15T12:00:00.000Z"
}
```

---

## 8. GET `/api/info/:id`

Series or movie details. Tries `/series/:id` then `/movies/:id` on the upstream site.

### Parameters

| Name | In | Required | Description |
|------|----|----------|-------------|
| `id` | path | yes | Title slug (e.g. `spy-x-family`) |
| `provider` | query | no | Upstream provider |

### Request

```http
GET /api/info/spy-x-family?provider=animesalt HTTP/1.1
Host: localhost:3000
```

```bash
curl -s "http://localhost:3000/api/info/spy-x-family"
curl -s "http://localhost:3000/api/info/your-name?provider=watchanimeworld"
```

### Response `200` — series

```json
{
  "id": "spy-x-family",
  "type": "series",
  "postId": "1101",
  "title": "Spy x Family",
  "image": "https://image.tmdb.org/t/p/w500/poster.jpg",
  "background": "https://image.tmdb.org/t/p/original/backdrop.jpg",
  "description": "A spy, an assassin, and a telepath form a makeshift family…",
  "genres": ["Action", "Comedy", "Slice of Life"],
  "languages": ["Hindi", "English"],
  "duration": "24 min",
  "year": "2022",
  "seasonsList": [1, 2, 3],
  "seasons": [1, 2, 3],
  "episodes": "25+",
  "episodesList": [
    {
      "id": "spy-x-family-1x1",
      "season": "1",
      "episode": "1",
      "title": "Operation Strix",
      "image": "https://example.cdn/ep1.jpg"
    }
  ],
  "recommended": [
    {
      "id": "mission-yozakura-family",
      "type": "series",
      "title": "Mission: Yozakura Family",
      "image": "https://example.cdn/rec.jpg",
      "year": "2024"
    }
  ]
}
```

### Response `200` — movie

Movies omit season/episode list fields:

```json
{
  "id": "your-name",
  "type": "movie",
  "postId": "2204",
  "title": "Your Name.",
  "image": "https://image.tmdb.org/t/p/w500/poster.jpg",
  "background": "https://image.tmdb.org/t/p/original/backdrop.jpg",
  "description": "Two strangers find themselves linked…",
  "genres": ["Romance", "Drama", "Supernatural"],
  "languages": ["Hindi", "Japanese"],
  "duration": "1h 46m",
  "year": "2016",
  "recommended": []
}
```

### Error `400`

```json
{
  "success": false,
  "error": "Failed to extract details data: Failed to fetch details for ID: not-a-real-slug",
  "timestamp": "2026-08-15T12:00:00.000Z"
}
```

---

## 9. GET `/api/episodes/:id/:season`

Season episode list via upstream AJAX (`admin-ajax.php` season action).

### Parameters

| Name | In | Required | Description |
|------|----|----------|-------------|
| `id` | path | yes | Series slug |
| `season` | path | yes | Positive integer season number |
| `provider` | query | no | Upstream provider |

### Request

```http
GET /api/episodes/spy-x-family/1 HTTP/1.1
Host: localhost:3000
```

```bash
curl -s "http://localhost:3000/api/episodes/spy-x-family/1"
curl -s "http://localhost:3000/api/episodes/naruto-shippuden/2?provider=waw"
```

### Response `200`

```json
{
  "id": "spy-x-family",
  "postId": "1101",
  "season": 1,
  "episodes": [
    {
      "id": "spy-x-family-1x1",
      "season": "1",
      "episode": "1",
      "title": "Operation Strix",
      "image": "https://example.cdn/ep1.jpg"
    },
    {
      "id": "spy-x-family-1x2",
      "season": "1",
      "episode": "2",
      "title": "Secure a Wife",
      "image": "https://example.cdn/ep2.jpg"
    }
  ]
}
```

Use each episode `id` with **`/api/embed/:id`**.

### Error `400`

Invalid season:

```json
{
  "success": false,
  "error": "Season must be a positive integer",
  "timestamp": "2026-08-15T12:00:00.000Z"
}
```

---

## 10. GET `/api/embed/:id`

Player / iframe servers for an episode (or fallback from details page).

### Parameters

| Name | In | Required | Description |
|------|----|----------|-------------|
| `id` | path | yes | Episode slug (e.g. `spy-x-family-1x1`) |
| `provider` | query | no | Upstream provider |

### Request

```http
GET /api/embed/spy-x-family-1x1 HTTP/1.1
Host: localhost:3000
```

```bash
curl -s "http://localhost:3000/api/embed/spy-x-family-1x1"
curl -s "http://localhost:3000/api/embed/spy-x-family-1x1?provider=watchanimeworld"
```

### Response `200`

```json
{
  "id": "spy-x-family-1x1",
  "servers": [
    {
      "server": 1,
      "name": "Server 1",
      "url": "https://player.example.com/embed/abc123"
    },
    {
      "server": 2,
      "name": "HD",
      "url": "https://stream.example.com/v/xyz789"
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `servers[].server` | Numeric order from upstream UI |
| `servers[].name` | Label shown on site |
| `servers[].url` | iframe / embed URL |

Servers named like “play” or known dead domains may be filtered out by the extractor.

---

## 11. GET `/api/category/*`

Browse by category path. Supports nested segments.

### Parameters

| Name | In | Required | Description |
|------|----|----------|-------------|
| `*` path | path | yes | Category path after `/category/` |
| `page` | query | no | Page number (default `1`) |
| `provider` | query | no | Upstream provider |

### Path patterns

| Example path | Meaning |
|--------------|---------|
| `/api/category/movies` | Movies listing |
| `/api/category/series` | Series listing |
| `/api/category/genre/sci-fi` | Genre |
| `/api/category/language/hindi` | Language |
| `/api/category/network/cartoon-network` | Network |
| `/api/category/franchise/pokemon` | Franchise |

### Request

```http
GET /api/category/language/hindi?page=1 HTTP/1.1
Host: localhost:3000
```

```bash
curl -s "http://localhost:3000/api/category/movies?page=1"
curl -s "http://localhost:3000/api/category/genre/sci-fi?page=2"
curl -s "http://localhost:3000/api/category/language/hindi?provider=animesalt"
curl -s "http://localhost:3000/api/category/network/disney"
curl -s "http://localhost:3000/api/category/franchise/naruto"
```

### Response `200`

```json
{
  "currentPage": 1,
  "totalPages": 12,
  "items": [
    {
      "id": "demon-slayer",
      "type": "series",
      "title": "Demon Slayer",
      "image": "https://image.tmdb.org/t/p/w500/example.jpg"
    },
    {
      "id": "jujutsu-kaisen",
      "type": "series",
      "title": "Jujutsu Kaisen",
      "image": "https://image.tmdb.org/t/p/w500/example2.jpg"
    }
  ]
}
```

---

## 12. GET `/api/letter/:letter`

Alphabetical index.

### Parameters

| Name | In | Required | Description |
|------|----|----------|-------------|
| `letter` | path | yes | Letter segment (e.g. `A`, `N`, `Z`) |
| `page` | query | no | Page number (default `1`) |
| `provider` | query | no | Upstream provider |

### Request

```http
GET /api/letter/N?page=1 HTTP/1.1
Host: localhost:3000
```

```bash
curl -s "http://localhost:3000/api/letter/N"
curl -s "http://localhost:3000/api/letter/D?page=2&provider=waw"
```

### Response `200`

```json
{
  "currentPage": 1,
  "totalPages": 4,
  "items": [
    {
      "id": "naruto",
      "type": "series",
      "title": "Naruto",
      "image": "https://image.tmdb.org/t/p/w500/example.jpg"
    },
    {
      "id": "naruto-shippuden",
      "type": "series",
      "title": "Naruto Shippuden",
      "image": "https://image.tmdb.org/t/p/w500/example2.jpg"
    }
  ]
}
```

---

## 13. GET `/api/scrape`

Placeholder generic scrape endpoint (validates URL only).

### Parameters

| Name | In | Required | Description |
|------|----|----------|-------------|
| `url` | query | yes | Absolute URL |
| `extractor` | query | no | Reserved |

### Request

```bash
curl -s "http://localhost:3000/api/scrape?url=https://animesalt.link/"
```

### Response `200`

```json
{
  "success": true,
  "data": {
    "message": "Scraper endpoint ready",
    "url": "https://animesalt.link/"
  },
  "message": "Scrape request received",
  "timestamp": "2026-08-15T12:00:00.000Z"
}
```

---

## 14. Error responses

Envelope used by middleware / controllers that call `sendError`:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "message": null,
  "timestamp": "2026-08-15T12:00:00.000Z"
}
```

| HTTP | When |
|------|------|
| `400` | Missing/invalid params, scrape failures surfaced as bad request |
| `403` | CORS / origin gate rejection (often HTML `403.html`) |
| `404` | Unknown route (HTML `404.html` for non-API assets) |
| `500` | Unexpected server errors |

### Examples

**Missing search param**

```bash
curl -s "http://localhost:3000/api/search"
```

```json
{
  "success": false,
  "error": "Either \"suggestion\" or \"q\" parameter is required",
  "timestamp": "2026-08-15T12:00:00.000Z"
}
```

**Missing episode season**

```bash
curl -s "http://localhost:3000/api/episodes/spy-x-family/"
```

→ routing 404 or validation error depending on path match.

---

## 15. Client integration notes

### Typical flow

```text
1. GET /api/home?provider=animesalt
2. User opens a title → GET /api/info/{id}
3. User picks season → GET /api/episodes/{id}/{season}
4. User plays episode → GET /api/embed/{episodeId}
5. Render servers[].url in an iframe / WebView
```

### JavaScript example

```js
const API = 'http://localhost:3000/api';

async function home(provider = 'animesalt') {
  const res = await fetch(`${API}/home?provider=${provider}`);
  const json = await res.json();
  return json.data; // when using sendSuccess envelope
}

async function search(q, provider = 'animesalt') {
  const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}&provider=${provider}`);
  return res.json();
}

async function play(episodeId, provider = 'animesalt') {
  const res = await fetch(`${API}/embed/${episodeId}?provider=${provider}`);
  const data = await res.json();
  return data.servers; // [{ server, name, url }]
}
```

### Python example

```python
import requests

API = "http://localhost:3000/api"

def get_home(provider="animesalt"):
    r = requests.get(f"{API}/home", params={"provider": provider}, timeout=30)
    r.raise_for_status()
    return r.json()

def get_episodes(series_id: str, season: int, provider="animesalt"):
    r = requests.get(
        f"{API}/episodes/{series_id}/{season}",
        params={"provider": provider},
        timeout=30,
    )
    r.raise_for_status()
    return r.json()
```

### Provider switching

Keep `provider` consistent across a user session so IDs from search/home resolve on the same upstream catalog.

```text
session.provider = "watchanimeworld"
GET /api/search?q=ben+10&provider=watchanimeworld
GET /api/info/ben-10?provider=watchanimeworld
GET /api/episodes/ben-10/1?provider=watchanimeworld
```

---

## Catalog item schema (shared)

Used across home, search, category, letter, recommended lists:

```ts
type CatalogItem = {
  id: string;          // slug
  type: "series" | "movie" | "unknown";
  title: string;
  image?: string;      // normalized absolute URL
  season?: string;     // optional label
  episodes?: string;   // optional label
  rank?: number;       // ranking lists only
  year?: string;       // recommended / some lists
};
```

---

## Rate & reliability

- Upstream sites may rate-limit or change HTML without notice.
- HTTP client retries failed GETs a few times by default.
- Cache responses in your app (especially `/home`, `/info`, `/episodes`) to reduce load.

---

## License & credit

**ISC** · Copyright © 2025 **Dark & Pyro Team**

Educational use only. Respect copyright laws and third-party terms of service.

---

*Renime API — Hindi anime REST, built to ship.*
