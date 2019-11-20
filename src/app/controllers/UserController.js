import User from '../models/User';
import Cache from '../../lib/Cache';

class UserController {
  async store(req, res) {
    const { email } = req.body;

    const UserExists = await User.findOne({
      where: { email },
    });

    if (UserExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, provider } = await User.create(req.body);

    if (provider) {
      await Cache.invalidate('providers');
    }

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const { email, password } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const UserExists = await User.findOne({
        where: { email },
      });

      if (UserExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (password && !(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Password does not match' });
    }

    await user.update(body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

export default new UserController();
