const express = require('express');
const User = require('../models/User');
const River = require('../models/River');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();

router.post('/admin/make-admin', async (req, res) => {
  try {
      const userId = req.body.userId;
      const user = await User.findByPk(userId);

      if (user) {
          user.role = 'admin';
          await user.save();
          res.send('<script>alert("Поздравляем, вы Админ!"); window.location.href = "/";</script>');
      } else {
          res.send('<script>alert("Пользователь не найлен"); window.location.href = "/";</script>');
      }
  } catch (error) {
      console.error(error);
      res.send('Ошибка сервера');
  }
});

router.get('/admin/add', isAuthenticated, (req, res) => {
    res.render('add', { user: req.session.user });
  });

router.get('/admin/add', isAuthenticated, async (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.send('<script>alert("Доступ запрещен"); window.location.href = "/";</script>');
  }
  const { name, length } = req.body;
  try {
    await River.create({ name, length });
    res.redirect('/');
  } catch (error) {
    res.send('Ошибка при создании реки');
  }
});

router.post('/admin/add', isAuthenticated, async (req, res) => {
    if (req.session.user.role !== 'admin') {
      return res.send('<script>alert("Доступ запрещен"); window.location.href = "/";</script>');
    }
    const { name, length } = req.body;
    try {
      await River.create({ name, length });
      res.redirect('/');
    } catch (error) {
      res.send('Ошибка при создании реки');
    }
  });

router.get('/admin/:id/edit', async (req, res) => {
    if (req.session.user.role !== 'admin') {
      return res.send('<script>alert("Доступ запрещен"); window.location.href = "/";</script>');
    }
    const riverId = req.params.id;
    try {
      const river = await River.findByPk(riverId);
      if (!river) {
        return res.status(404).send('Река не найдена');
      }
      res.render('edit', { river, user: req.session.user });
    } catch (error) {
      console.error('Ошибка при обработке GET-запроса для редактирования реки:', error);
      res.status(500).send('Ошибка сервера');
    }
  });

router.post('/admin/:id/edit', isAuthenticated, async (req, res) => {
    if (req.session.user.role !== 'admin') {
      return res.send('<script>alert("Доступ запрещен"); window.location.href = "/";</script>');
    }
    const riverId = req.params.id;
    const { name, length } = req.body;
    try {
      const updatedRiver = await River.findByPk(riverId);
      if (!updatedRiver) {
        return res.status(404).send('Река не найдена');
      }
      updatedRiver.name = name;
      updatedRiver.length = length;
      await updatedRiver.save();
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Ошибка сервера');
    }
  });

  router.post('/admin/:id/delete', isAuthenticated, async (req, res) => {
    if (req.session.user.role !== 'admin') {
      return res.send('<script>alert("Доступ запрещен"); window.location.href = "/";</script>');
    }
    const riverId = req.params.id;
    try {
      await River.destroy({ where: { id: riverId } });
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Ошибка при удалении реки');
    }
  });

module.exports = router;
