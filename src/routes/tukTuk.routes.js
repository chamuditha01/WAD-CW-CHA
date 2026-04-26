import { Router } from 'express';
import { body } from 'express-validator';
import { tukTukController } from '../controllers/tukTukController.js';
import { locationController } from '../controllers/locationController.js';
import { authenticate, authorize, deviceOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

/**
 * @swagger
 * /api/tuktuks:
 *   get:
 *     tags: [TukTuks]
 *     summary: List all registered tuk-tuks (scoped by role)
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
 *         name: status
 *         schema: { type: string, enum: [active, inactive, suspended] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by reg number, driver name, owner name, or NIC
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated list of tuk-tuks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/TukTuk' }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get(
  '/',
  authenticate,
  authorize('hq_admin', 'province_admin', 'district_admin', 'station_officer'),
  tukTukController.getAll
);

/**
 * @swagger
 * /api/tuktuks/live:
 *   get:
 *     tags: [TukTuks]
 *     summary: Get last-known live location for all active tuk-tuks
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
 *         description: Array of live locations
 */
router.get(
  '/live',
  authenticate,
  authorize('hq_admin', 'province_admin', 'district_admin', 'station_officer'),
  tukTukController.getLiveLocations
);

/**
 * @swagger
 * /api/tuktuks/{id}:
 *   get:
 *     tags: [TukTuks]
 *     summary: Get a single tuk-tuk by ID or registration number
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Numeric ID or registration number (e.g. WP CAB-1234)
 *     responses:
 *       200:
 *         description: Tuk-tuk object
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data: { $ref: '#/components/schemas/TukTuk' }
 *       404:
 *         description: Not found
 */
router.get(
  '/:id',
  authenticate,
  authorize('hq_admin', 'province_admin', 'district_admin', 'station_officer'),
  tukTukController.getById
);

/**
 * @swagger
 * /api/tuktuks:
 *   post:
 *     tags: [TukTuks]
 *     summary: Register a new tuk-tuk (HQ / Province / District Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [registrationNumber, ownerName, driverName, driverNIC, contactNumber, districtId, provinceId]
 *             properties:
 *               registrationNumber: { type: string, example: 'WP CAB-1234' }
 *               ownerName: { type: string }
 *               driverName: { type: string }
 *               driverNIC: { type: string, example: '198512345678' }
 *               contactNumber: { type: string }
 *               districtId: { type: string }
 *               provinceId: { type: string }
 *               deviceId: { type: string, description: 'Auto-generated if omitted' }
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *                 default: active
 *     responses:
 *       201:
 *         description: Tuk-tuk registered
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data: { $ref: '#/components/schemas/TukTuk' }
 *       409:
 *         description: Registration number already exists
 */
router.post(
  '/',
  authenticate,
  authorize('hq_admin', 'province_admin', 'district_admin'),
  [
    body('registrationNumber').notEmpty().trim(),
    body('ownerName').notEmpty().trim(),
    body('driverName').notEmpty().trim(),
    body('driverNIC').notEmpty().trim(),
    body('contactNumber').notEmpty().trim(),
    body('districtId').notEmpty(),
    body('provinceId').notEmpty(),
    validate,
  ],
  tukTukController.create
);

/**
 * @swagger
 * /api/tuktuks/{id}:
 *   patch:
 *     tags: [TukTuks]
 *     summary: Update tuk-tuk details or status
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
 *               ownerName: { type: string }
 *               driverName: { type: string }
 *               contactNumber: { type: string }
 *               status: { type: string, enum: [active, inactive, suspended] }
 *     responses:
 *       200:
 *         description: Updated tuk-tuk
 *       404:
 *         description: Not found
 */
router.patch(
  '/:id',
  authenticate,
  authorize('hq_admin', 'province_admin', 'district_admin'),
  tukTukController.update
);

/**
 * @swagger
 * /api/tuktuks/{id}:
 *   delete:
 *     tags: [TukTuks]
 *     summary: Remove a tuk-tuk (HQ Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Removed
 *       404:
 *         description: Not found
 */
router.delete(
  '/:id',
  authenticate,
  authorize('hq_admin'),
  tukTukController.delete
);

/**
 * @swagger
 * /api/tuktuks/{id}/ping:
 *   post:
 *     tags: [Location]
 *     summary: Submit a GPS location ping (device role only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Tuk-tuk ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [latitude, longitude]
 *             properties:
 *               latitude: { type: number, example: 6.9271 }
 *               longitude: { type: number, example: 79.8612 }
 *               speed: { type: number, example: 22.5 }
 *               heading: { type: number, example: 270 }
 *               accuracy: { type: number, example: 4.5 }
 *               batteryLevel: { type: number, example: 76 }
 *               timestamp: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Ping recorded
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 data: { $ref: '#/components/schemas/LocationPing' }
 *       403:
 *         description: Device not authorized for this tuk-tuk
 */
router.post(
  '/:id/ping',
  authenticate,
  deviceOnly,
  [
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
    body('speed').optional().isFloat({ min: 0 }),
    body('heading').optional().isFloat({ min: 0, max: 360 }),
    body('batteryLevel').optional().isFloat({ min: 0, max: 100 }),
    validate,
  ],
  locationController.submitPing
);

/**
 * @swagger
 * /api/tuktuks/{id}/history:
 *   get:
 *     tags: [Location]
 *     summary: Get location history for a tuk-tuk (time-window)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *         description: Start of time window (ISO 8601)
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *         description: End of time window (ISO 8601)
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200:
 *         description: Paginated location history
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
  '/:id/history',
  authenticate,
  authorize('hq_admin', 'province_admin', 'district_admin', 'station_officer'),
  locationController.getHistory
);

export default router;
