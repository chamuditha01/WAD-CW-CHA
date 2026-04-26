import { provinceService, districtService, stationService } from '../services/geoService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const provinceController = {
  getAll(req, res) {
    sendSuccess(res, provinceService.getAll());
  },
  getById(req, res) {
    const p = provinceService.getById(req.params.id);
    if (!p) return sendError(res, 'Province not found', 404);
    sendSuccess(res, p);
  },
  getDistricts(req, res) {
    const districts = provinceService.getDistricts(req.params.id);
    sendSuccess(res, districts);
  },
};

export const districtController = {
  getAll(req, res) {
    sendSuccess(res, districtService.getAll({ provinceId: req.query.provinceId }));
  },
  getById(req, res) {
    const d = districtService.getById(req.params.id);
    if (!d) return sendError(res, 'District not found', 404);
    sendSuccess(res, d);
  },
  getStations(req, res) {
    sendSuccess(res, districtService.getStations(req.params.id));
  },
};

export const stationController = {
  getAll(req, res) {
    const { districtId, provinceId } = req.query;
    sendSuccess(res, stationService.getAll({ districtId, provinceId }));
  },
  getById(req, res) {
    const s = stationService.getById(req.params.id);
    if (!s) return sendError(res, 'Station not found', 404);
    sendSuccess(res, s);
  },
  create(req, res) {
    const station = stationService.create(req.body);
    sendSuccess(res, station, 'Station created', 201);
  },
  update(req, res) {
    const station = stationService.update(req.params.id, req.body);
    if (!station) return sendError(res, 'Station not found', 404);
    sendSuccess(res, station, 'Station updated');
  },
  delete(req, res) {
    const deleted = stationService.delete(req.params.id);
    if (!deleted) return sendError(res, 'Station not found', 404);
    sendSuccess(res, null, 'Station removed');
  },
};
