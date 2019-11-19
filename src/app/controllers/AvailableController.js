import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import AvailableService from '../services/AvailableService';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;
    const { provider_id } = req.params;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);

    const available = await AvailableService.list({ searchDate, provider_id });

    return res.json(available);
  }
}

export default new AvailableController();
