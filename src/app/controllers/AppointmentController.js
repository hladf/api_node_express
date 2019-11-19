import { isBefore, subHours } from 'date-fns';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import CreateAppointmentService from '../services/CreateAppointmentService';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    const { page = 1, limit = 20 } = req.query;

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

    return res.json(appointments);
  }

  async store(req, res) {
    const { provider_id, userId: user_id, date } = req.body;
    const appointment = await CreateAppointmentService.run({
      provider_id,
      user_id,
      date,
    });
    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    // só o proprio usuario pode cancelar o seu agendamento
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: 'You dont have permission to cancel this appointment',
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    // só pode cancelar o agendamento com 2h de antecedencia
    // para 'segurança' do provider
    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json({ error: 'You can only cancel to hours in advance' });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
