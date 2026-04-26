import { locationService } from '../services/locationService.js';
import { sendSuccess, sendPaginated, sendError } from '../utils/response.js';

export const locationController = {
  submitPing(req, res) {
    try {
      const tukTukId = req.params.id;
      // Device role: ensure the device can only ping for its linked tuk-tuk
      if (req.user.role === 'device' && req.user.linkedTukTukId !== String(tukTukId)) {
        return sendError(res, 'Device not authorized for this tuk-tuk', 403);
      }
      const ping = locationService.submitPing(tukTukId, req.body);
      sendSuccess(res, ping, 'Location ping recorded', 201);
    } catch (err) {
      sendError(res, err.message, 400);
    }
  },

  getHistory(req, res) {
    const { from, to, page, limit } = req.query;
    const result = locationService.getHistory(req.params.id, { from, to, page, limit });
    sendPaginated(res, result.data, result.total, result.page, result.limit);
  },

  getRecentPings(req, res) {
    const { provinceId, districtId, from, to, page, limit } = req.query;
    const user = req.user;
    const scopedProvince = user.role === 'hq_admin' ? provinceId : (user.provinceId || provinceId);
    const scopedDistrict = ['district_admin', 'station_officer'].includes(user.role)
      ? (user.districtId || districtId) : districtId;

    const result = locationService.getRecentPings({
      provinceId: scopedProvince, districtId: scopedDistrict,
      from, to, page, limit,
    });
    sendPaginated(res, result.data, result.total, result.page, result.limit);
  },

  getLiveSnapshot(req, res) {
    const { provinceId, districtId } = req.query;
    const user = req.user;
    const scopedProvince = user.role === 'hq_admin' ? provinceId : (user.provinceId || provinceId);
    const scopedDistrict = ['district_admin', 'station_officer'].includes(user.role)
      ? (user.districtId || districtId) : districtId;

    const data = locationService.getLatestPerVehicle({
      provinceId: scopedProvince, districtId: scopedDistrict,
    });
    sendSuccess(res, data, `Live snapshot: ${data.length} vehicles`);
  },
};
