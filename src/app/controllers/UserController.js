import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
    });

    const { body } = req;
    try {
      await schema.validate(body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }
    const { email } = body;

    const UserExists = await User.findOne({
      where: { email },
    });

    if (UserExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, provider } = await User.create(body);

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      // torna o confirm obrigatório apenas se o password for informado
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    const { body } = req;
    try {
      await schema.validate(body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }
    const { email, password } = body;

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

    const { id, name, provider } = await user.update(body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
