import {
  startOfHour,
  isBefore,
  format,
  parseISO,
  isBefore,
  subHours,
} from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from '../models/User';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentService {
  async create({ provider_id, user_id, date }) {
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      throw new Error('You can only create appointments with providers');
    }

    const hourStart = startOfHour(parseISO(date));

    // checando se a data não ta no passado
    if (isBefore(hourStart, new Date())) {
      throw new Error('Past dates are not permitted');
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      throw new Error('Appointment date is not avaliable');
    }

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date,
    });

    // criando a notificação pro provider
    const user = await User.findByPk(user_id);
    const formattedDate = format(hourStart, "dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para dia ${formattedDate}`,
      user: provider_id,
    });

    return appointment;
  }

  async cancel({ appointment_id, user_id }) {
    const appointment = await Appointment.findByPk(appointment_id, {
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
    if (appointment.user_id !== user_id) {
      throw new Error('You dont have permission to cancel this appointment');
    }

    const dateWithSub = subHours(appointment.date, 2);

    // só pode cancelar o agendamento com 2h de antecedencia
    // para 'segurança' do provider
    if (isBefore(dateWithSub, new Date())) {
      throw new Error('You can only cancel to hours in advance');
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return appointment;
  }
}

export default new AppointmentService();
