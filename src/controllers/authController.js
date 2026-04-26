import { authService } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const authController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      if (!result) return sendError(res, 'Invalid username or password', 401);
      sendSuccess(res, result, 'Login successful');
    } catch (err) {
      sendError(res, err.message);
    }
  },

  refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return sendError(res, 'Refresh token required', 400);
      const accessToken = authService.refreshToken(refreshToken);
      if (!accessToken) return sendError(res, 'Invalid or expired refresh token', 401);
      sendSuccess(res, { accessToken }, 'Token refreshed');
    } catch {
      sendError(res, 'Invalid or expired refresh token', 401);
    }
  },

  me(req, res) {
    sendSuccess(res, req.user, 'Current user');
  },

  async createUser(req, res) {
    try {
      const user = await authService.createUser(req.body);
      sendSuccess(res, user, 'User created', 201);
    } catch (err) {
      sendError(res, err.message, 409);
    }
  },
};
