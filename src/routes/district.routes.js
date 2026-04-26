import { Router } from 'express';
import { districtController } from '../controllers/geoController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/districts:
 *   get:
 *     tags: [Districts]
 *     summary: Get all districts (optionally filter by provinceId)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: provinceId
 *         schema: { type: string }
 *         description: Filter by province
 *     responses:
 *       200:
 *         description: List of districts
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/District' }
 */
router.get('/', authenticate, districtController.getAll);

/**
 * @swagger
 * /api/districts/{id}:
 *   get:
 *     tags: [Districts]
 *     summary: Get a district by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: District object
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data: { $ref: '#/components/schemas/District' }
 *       404:
 *         description: Not found
 */
router.get('/:id', authenticate, districtController.getById);

/**
 * @swagger
 * /api/districts/{id}/stations:
 *   get:
 *     tags: [Districts]
 *     summary: Get all police stations within a district
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of stations
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Station' }
 */
router.get('/:id/stations', authenticate, districtController.getStations);

export default router;
