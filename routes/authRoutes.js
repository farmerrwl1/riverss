const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
          return res.send('<script>alert("Пользователь с таким именем не найден"); window.location.href = "/auth/login";</script>');
        }
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
          return res.send('<script>alert("Неверный пароль"); window.location.href = "/auth/login";</script>');
        }
        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Что-то пошло не так на сервере');
    }
});

router.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    res.send('Ошибка при регистрации пользователя');
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

router.get('/auth/login', (req, res) => {
    res.render('login', { user: req.session.user });
});

router.get('/auth/register', (req, res) => {
    res.render('register', { user: req.session.user });
});

module.exports = router;
