import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { sendError } from '../utils/response.js';

/**
 * Verify JWT and attach decoded payload to req.user.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authorization token required', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, config.jwt.secret);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired', 401);
    }
    return sendError(res, 'Invalid token', 401);
  }
};

/**
 * Role-based access control.
 * Usage: authorize('hq_admin', 'province_admin')
 */
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return sendError(res, 'Unauthorized', 401);
  if (!roles.includes(req.user.role)) {
    return sendError(res, `Access denied. Required role(s): ${roles.join(', ')}`, 403);
  }
  next();
};

/**
 * Device-only middleware — only tuk-tuk GPS devices may call ping endpoints.
 */
export const deviceOnly = (req, res, next) => {
  if (!req.user) return sendError(res, 'Unauthorized', 401);
  if (req.user.role !== 'device') {
    return sendError(res, 'Only registered devices may submit location pings', 403);
  }
  next();
};

/**
 * Scope guard — ensures a province/district_admin can only access their own scope.
 * Attach after authenticate(). Skips check for hq_admin.
 */
export const scopeGuard = (req, res, next) => {
  if (!req.user) return sendError(res, 'Unauthorized', 401);
  const { role, provinceId, districtId } = req.user;

  if (role === 'hq_admin') return next(); // full access

  // If the route has a provinceId param, enforce it
  if (req.params.provinceId && req.params.provinceId !== String(provinceId)) {
    return sendError(res, 'Access to this province is not permitted', 403);
  }
  if (req.params.districtId && districtId && req.params.districtId !== String(districtId)) {
    return sendError(res, 'Access to this district is not permitted', 403);
  }
  next();
};
