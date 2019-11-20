import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleService {
  async list({ userId, date }) {
    const checkUserProvider = await User.findOne({
      where: { id: userId, provider: true },
    });

    if (!checkUserProvider) {
      throw new Error('User is not a provider');
    }

    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    return appointments;
  }
}

export default new ScheduleService();
