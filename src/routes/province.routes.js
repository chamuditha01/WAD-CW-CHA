import { Router } from 'express';
import { provinceController } from '../controllers/geoController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/provinces:
 *   get:
 *     tags: [Provinces]
 *     summary: Get all 9 provinces
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of provinces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Province' }
 */
router.get('/', authenticate, provinceController.getAll);

/**
 * @swagger
 * /api/provinces/{id}:
 *   get:
 *     tags: [Provinces]
 *     summary: Get a province by ID or code
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Province ID or code (e.g. WP)
 *     responses:
 *       200:
 *         description: Province object
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data: { $ref: '#/components/schemas/Province' }
 *       404:
 *         description: Not found
 */
router.get('/:id', authenticate, provinceController.getById);

/**
 * @swagger
 * /api/provinces/{id}/districts:
 *   get:
 *     tags: [Provinces]
 *     summary: Get all districts within a province
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
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
router.get('/:id/districts', authenticate, provinceController.getDistricts);

export default router;
