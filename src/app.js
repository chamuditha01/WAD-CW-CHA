import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { config } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { initStore } from './models/index.js';

import authRoutes     from './routes/auth.routes.js';
import provinceRoutes from './routes/province.routes.js';
import districtRoutes from './routes/district.routes.js';
import stationRoutes  from './routes/station.routes.js';
import tukTukRoutes   from './routes/tukTuk.routes.js';
import locationRoutes from './routes/location.routes.js';
import userRoutes     from './routes/user.routes.js';

import { notFound, errorHandler } from './middleware/errorHandler.js';

// ─── Bootstrap ──────────────────────────────────────────────────────────────
initStore();

const app = express();

// ─── Security & Parsing ─────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Logging ────────────────────────────────────────────────────────────────
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// ─── Rate Limiting ──────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000,
  message: { success: false, message: 'Too many login attempts.' },
});
app.use('/api/auth/login', authLimiter);

// ─── Swagger UI ─────────────────────────────────────────────────────────────
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Tuk-Tuk Tracking API',
    customCss: '.swagger-ui .topbar { background-color: #1a237e; }',
    swaggerOptions: { persistAuthorization: true },
  })
);

// Expose raw OpenAPI JSON
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TukTuk Tracking API',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/provinces', provinceRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/stations',  stationRoutes);
app.use('/api/tuktuks',   tukTukRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/users',     userRoutes);

// ─── Error Handling ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start ──────────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n🚀  TukTuk Tracking API`);
  console.log(`   Environment : ${config.nodeEnv}`);
  console.log(`   Listening   : http://localhost:${config.port}`);
  console.log(`   Swagger UI  : http://localhost:${config.port}/api/docs`);
  console.log(`   Health      : http://localhost:${config.port}/health\n`);
});

export default app;
