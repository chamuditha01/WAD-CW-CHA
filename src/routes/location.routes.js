import { Router } from 'express';
import { locationController } from '../controllers/locationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/locations/snapshot:
 *   get:
 *     tags: [Location]
 *     summary: Live snapshot — latest ping per active vehicle (scoped by role)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: provinceId
 *         schema: { type: string }
 *       - in: query
 *         name: districtId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Array of { tukTuk, ping } pairs
 */
router.get(
  '/snapshot',
  authenticate,
  authorize('hq_admin', 'province_admin', 'district_admin', 'station_officer'),
  locationController.getLiveSnapshot
);

/**
 * @swagger
 * /api/locations:
 *   get:
 *     tags: [Location]
 *     summary: Query recent pings across all vehicles (scoped by role)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: provinceId
 *         schema: { type: string }
 *       - in: query
 *         name: districtId
 *         schema: { type: string }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200:
 *         description: Paginated location pings
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/LocationPing' }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get(
  '/',
  authenticate,
  authorize('hq_admin', 'province_admin', 'district_admin', 'station_officer'),
  locationController.getRecentPings
);

export default router;
