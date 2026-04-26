import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tuk-Tuk Tracking API',
      version: '1.0.0',
      description: `
## Real-Time Three-Wheeler (Tuk-Tuk) Tracking & Movement Logging System
### Sri Lanka Police — Law Enforcement Platform

This API provides:
- **Vehicle Management** – Register, update, and query tuk-tuks
- **Live Location Tracking** – Receive and query real-time GPS pings
- **Historical Movement Logs** – Time-windowed location history per vehicle
- **Province/District Filtering** – Operational queries scoped by jurisdiction
- **User & Role Management** – HQ, Provincial, District, Station, and Device roles
- **Secure Auth** – JWT-based authentication with role-based access control

### Roles
| Role | Description |
|------|-------------|
| \`hq_admin\` | Full system access (Police HQ) |
| \`province_admin\` | Province-scoped access |
| \`district_admin\` | District-scoped access |
| \`station_officer\` | Station-scoped read/query |
| \`device\` | Tuk-tuk GPS device — location ping only |
      `,
      contact: {
        name: 'Sri Lanka Police — IT Division',
      },
    },
    servers: [
      { url: config.apiBaseUrl, description: 'Active server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token from /api/auth/login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
        Province: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Western Province' },
            code: { type: 'string', example: 'WP' },
          },
        },
        District: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Colombo' },
            provinceId: { type: 'string' },
            lat: { type: 'number', example: 6.9271 },
            lng: { type: 'number', example: 79.8612 },
            spread: { type: 'number', example: 0.3 },
          },
        },
        Station: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Colombo Fort Police Station' },
            districtId: { type: 'string' },
            contact: { type: 'string', example: '+94112345678' },
          },
        },
        TukTuk: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            registrationNumber: { type: 'string', example: 'WP CAB-1234' },
            ownerName: { type: 'string' },
            driverName: { type: 'string' },
            driverNIC: { type: 'string', example: '198512345678' },
            contactNumber: { type: 'string' },
            districtId: { type: 'string' },
            provinceId: { type: 'string' },
            deviceId: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive', 'suspended'] },
            lastLat: { type: 'number' },
            lastLng: { type: 'number' },
            lastSpeed: { type: 'number' },
            lastHeading: { type: 'number' },
            lastTimestamp: { type: 'string', format: 'date-time' },
            registeredAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        LocationPing: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            pingId: { type: 'string' },
            tukTukId: { type: 'string' },
            regNumber: { type: 'string' },
            latitude: { type: 'number', example: 6.9271 },
            longitude: { type: 'number', example: 79.8612 },
            speed: { type: 'number', example: 25.5 },
            heading: { type: 'number', example: 180 },
            accuracy: { type: 'number', example: 5.0 },
            batteryLevel: { type: 'number', example: 85 },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            username: { type: 'string' },
            role: { type: 'string', enum: ['hq_admin', 'province_admin', 'district_admin', 'station_officer', 'device'] },
            provinceId: { type: 'string' },
            districtId: { type: 'string' },
            stationId: { type: 'string' },
            linkedTukTukId: { type: 'string' },
            isActive: { type: 'boolean' },
            lastLogin: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication & token management' },
      { name: 'Provinces', description: 'Province master data' },
      { name: 'Districts', description: 'District master data' },
      { name: 'Stations', description: 'Police station management' },
      { name: 'TukTuks', description: 'Tuk-tuk vehicle management' },
      { name: 'Location', description: 'Live location pings & history' },
      { name: 'Users', description: 'User & role management (HQ Admin only)' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
