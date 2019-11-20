import ScheduleService from '../services/ScheduleService';

/**
 * lista os agendamentos do provider logado
 */
class ScheduleController {
  async index(req, res) {
    const appointments = await ScheduleService.list({
      userId: req.userId,
      date: req.query.date,
    });

    return res.json({ appointments });
  }
}

export default new ScheduleController();
