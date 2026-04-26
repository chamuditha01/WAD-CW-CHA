import { validationResult } from 'express-validator';
import { sendError } from '../utils/response.js';

/**
 * Run after express-validator chains.
 * Returns 400 with field errors if validation failed.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 'Validation failed', 400, errors.array());
  }
  next();
};
