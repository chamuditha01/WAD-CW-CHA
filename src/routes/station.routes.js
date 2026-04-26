import { Router } from 'express';
import { body } from 'express-validator';
import { stationController } from '../controllers/geoController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

/**
 * @swagger
 * /api/stations:
 *   get:
 *     tags: [Stations]
 *     summary: Get all police stations (filter by districtId or provinceId)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: districtId
 *         schema: { type: string }
 *       - in: query
 *         name: provinceId
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
router.get('/', authenticate, stationController.getAll);

/**
 * @swagger
 * /api/stations/{id}:
 *   get:
 *     tags: [Stations]
 *     summary: Get a station by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Station object
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data: { $ref: '#/components/schemas/Station' }
 *       404:
 *         description: Not found
 */
router.get('/:id', authenticate, stationController.getById);

/**
 * @swagger
 * /api/stations:
 *   post:
 *     tags: [Stations]
 *     summary: Register a new police station (HQ / Province Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, districtId]
 *             properties:
 *               name: { type: string, example: 'Negombo Police Station' }
 *               districtId: { type: string }
 *               contact: { type: string, example: '+94312223344' }
 *     responses:
 *       201:
 *         description: Station created
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  authenticate,
  authorize('hq_admin', 'province_admin'),
  [
    body('name').notEmpty().trim(),
    body('districtId').notEmpty(),
    validate,
  ],
  stationController.create
);

/**
 * @swagger
 * /api/stations/{id}:
 *   patch:
 *     tags: [Stations]
 *     summary: Update a station (HQ / Province Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               contact: { type: string }
 *     responses:
 *       200:
 *         description: Station updated
 *       404:
 *         description: Not found
 */
router.patch(
  '/:id',
  authenticate,
  authorize('hq_admin', 'province_admin'),
  stationController.update
);

/**
 * @swagger
 * /api/stations/{id}:
 *   delete:
 *     tags: [Stations]
 *     summary: Delete a station (HQ Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Station removed
 *       404:
 *         description: Not found
 */
router.delete(
  '/:id',
  authenticate,
  authorize('hq_admin'),
  stationController.delete
);

export default router;
