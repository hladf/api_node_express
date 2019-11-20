import User from '../models/User';
import File from '../models/File';

import Cache from '../../lib/Cache';

class ProviderController {
  async index(req, res) {
    const cached = await Cache.get('providers');

    if (cached) {
      console.log('>>> busca de dados em cache...');

      return res.json(cached);
    }

    const providers = await User.findAll({
      where: { provider: true },
      attibutes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    await Cache.set('providers', providers);

    return res.json(providers);
  }
}

export default new ProviderController();
