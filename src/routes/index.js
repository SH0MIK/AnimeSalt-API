/**
 * Copyright (c) 2025 Dark & Pyro Team
 * ⚠️ Educational use only. Respect copyright laws.
 */

const { Router } = require('express');
const { ScraperController, HomeController, TypeController, DetailsController, EpisodesController, EmbedController, SearchController } = require('../controllers');
const { validateQuery } = require('../middleware');
const { z } = require('zod');

const router = Router();
const scraperController = new ScraperController();
const homeController = new HomeController();
const typeController = new TypeController();
const detailsController = new DetailsController();
const episodesController = new EpisodesController();
const embedController = new EmbedController();
const searchController = new SearchController();

// Home route
router.get('/home', (req, res, next) => homeController.home(req, res, next));

// Details route
router.get('/info/:id', (req, res, next) => detailsController.getDetails(req, res, next));

// Episodes route
router.get('/episodes/:id/:season', (req, res, next) => episodesController.getEpisodes(req, res, next));

// Embed route
router.get('/embed/:id', (req, res, next) => embedController.getEmbed(req, res, next));

// Search route
const searchSchema = z.object({
  suggestion: z.string().min(1).optional(),
  q: z.string().min(1).optional(),
}).refine((data) => data.suggestion || data.q, {
  message: 'Either "suggestion" or "q" parameter is required',
});

router.get(
  '/search',
  validateQuery(searchSchema),
  (req, res, next) => searchController.search(req, res, next)
);

// Category route - supports unlimited category paths
// Examples:
// - /api/category/language/english/
// - /api/category/genre/sci-fi/
// - /api/category/network/cartoon-network/ (supports any network name)
// - /api/category/network/disney/
// - /api/category/network/nickelodeon/
// - /api/category/franchise/pokemon/ (supports any franchise name)
// - /api/category/franchise/naruto/
// - /api/category/franchise/dragon-ball/
const pageSchema = z.object({
  page: z.string().regex(/^\d+$/).optional().default('1'),
});

router.get(
  '/category/*',
  validateQuery(pageSchema),
  (req, res, next) => {
    // Extract type from wildcard path (everything after /category/)
    // Supports nested paths like network/cartoon-network, franchise/pokemon, etc.
    const type = req.params[0] || '';
    req.params.type = type;
    req.params.pathType = 'category';
    typeController.getType(req, res, next);
  }
);

// Letter route (for alphabetical browsing)
router.get(
  '/letter/*',
  validateQuery(pageSchema),
  (req, res, next) => {
    // Extract letter from wildcard path (everything after /letter/)
    const type = req.params[0] || '';
    req.params.type = type;
    req.params.pathType = 'letter';
    typeController.getType(req, res, next);
  }
);

// Health check route
router.get('/health', (req, res, next) => scraperController.health(req, res, next));

// List supported providers (animesalt, watchanimeworld, ...)
router.get('/providers', (req, res, next) => scraperController.providers(req, res, next));

// Scraper routes - GET only
const scrapeSchema = z.object({
  url: z.string().url('Invalid URL format'),
  extractor: z.string().optional(),
});

router.get(
  '/scrape',
  validateQuery(scrapeSchema),
  (req, res, next) => scraperController.scrape(req, res, next)
);

module.exports = router;
