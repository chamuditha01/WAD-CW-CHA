import { tukTukService } from '../services/tukTukService.js';
import { sendSuccess, sendPaginated, sendError } from '../utils/response.js';

export const tukTukController = {
  getAll(req, res) {
    const { provinceId, districtId, status, search, page, limit } = req.query;

    // Scope restriction for non-HQ roles
    const user = req.user;
    const scopedProvince = user.role === 'hq_admin' ? provinceId : (user.provinceId || provinceId);
    const scopedDistrict = ['district_admin','station_officer'].includes(user.role)
      ? (user.districtId || districtId) : districtId;

    const result = tukTukService.getAll({
      provinceId: scopedProvince, districtId: scopedDistrict,
      status, search, page, limit,
    });
    sendPaginated(res, result.data, result.total, result.page, result.limit);
  },

  getById(req, res) {
    const tukTuk = tukTukService.getById(req.params.id);
    if (!tukTuk) return sendError(res, 'Tuk-tuk not found', 404);
    sendSuccess(res, tukTuk);
  },

  create(req, res) {
    try {
      const tukTuk = tukTukService.create(req.body);
      sendSuccess(res, tukTuk, 'Tuk-tuk registered', 201);
    } catch (err) {
      sendError(res, err.message, 409);
    }
  },

  update(req, res) {
    const tukTuk = tukTukService.update(req.params.id, req.body);
    if (!tukTuk) return sendError(res, 'Tuk-tuk not found', 404);
    sendSuccess(res, tukTuk, 'Tuk-tuk updated');
  },

  delete(req, res) {
    const deleted = tukTukService.delete(req.params.id);
    if (!deleted) return sendError(res, 'Tuk-tuk not found', 404);
    sendSuccess(res, null, 'Tuk-tuk removed');
  },

  getLiveLocations(req, res) {
    const { provinceId, districtId } = req.query;
    const user = req.user;
    const scopedProvince = user.role === 'hq_admin' ? provinceId : (user.provinceId || provinceId);
    const scopedDistrict = ['district_admin','station_officer'].includes(user.role)
      ? (user.districtId || districtId) : districtId;

    const data = tukTukService.getLiveLocations({
      provinceId: scopedProvince, districtId: scopedDistrict,
    });
    sendSuccess(res, data, `${data.length} vehicles with live location`);
  },
};
