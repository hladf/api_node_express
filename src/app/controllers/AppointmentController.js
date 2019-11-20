import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import AppointmentService from '../services/AppointmentService';
import Cache from '../../lib/Cache';

class AppointmentController {
  async index(req, res) {
    const { page = 1, limit = 20 } = req.query;

    const cacheKey = `user:${req.userId}:appointments:${page}/${limit}`;
    const cached = await Cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      limit,
      offset: (page - 1) * limit,
      attributes: ['id', 'date', 'past', 'cancelable'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    await Cache.set(cacheKey, appointments);

    return res.json(appointments);
  }

  async store(req, res) {
    const { provider_id, userId: user_id, date } = req.body;

    const appointment = await AppointmentService.create({
      provider_id,
      user_id,
      date,
    });
    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await AppointmentService.cancel({
      appointment_id: req.params.id,
      user_id: req.userId,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
