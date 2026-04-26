import { userService } from '../services/userService.js';
import { sendSuccess, sendPaginated, sendError } from '../utils/response.js';

export const userController = {
  getAll(req, res) {
    const { role, provinceId, districtId, stationId, isActive, page, limit } = req.query;
    const result = userService.getAll({ role, provinceId, districtId, stationId, isActive, page, limit });
    sendPaginated(res, result.data, result.total, result.page, result.limit);
  },

  getById(req, res) {
    const user = userService.getById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user);
  },

  update(req, res) {
    const user = userService.update(req.params.id, req.body);
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user, 'User updated');
  },

  deactivate(req, res) {
    const user = userService.deactivate(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user, 'User deactivated');
  },

  activate(req, res) {
    const user = userService.activate(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user, 'User activated');
  },
};
