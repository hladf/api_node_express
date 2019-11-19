import { startOfHour, isBefore, format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from '../models/User';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
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
}

export default new CreateAppointmentService();
