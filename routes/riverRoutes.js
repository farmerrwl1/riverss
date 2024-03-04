const express = require('express');
const River = require('../models/River');
const FavoriteItem = require('../models/FavoriteItem');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.id) {
          const Rivers = await River.findAll();
          res.render('index', { Rivers, user: req.session.user });
        } else {
          const Rivers = await River.findAll();
          const favoriteRivers = await FavoriteItem.findAll({ where: { userId: req.session.user.id } });
          res.render('index', { Rivers, favoriteRivers, user: req.session.user });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера');
    }
});

router.get('/favoriteRivers', async (req, res) => {
    try {
      const userId = req.session.user.id;
      const favoriteRivers = await FavoriteItem.findAll({
        where: { userId },
        include: [{ model: River, as: 'river', attributes: ['id', 'name', 'length'] }]
      });
      res.render('favoriteRivers', { favoriteRivers, user: req.session.user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Ошибка сервера');
    }
  });
  
  router.post('/favorites/add', isAuthenticated, async (req, res) => {
    const { riverId } = req.body;
    const userId = req.session.user.id;
    try {
      const existingFavorite = await FavoriteItem.findOne({ where: { userId, riverId } });
      if (existingFavorite) {
        return res.send('<script>alert("Река уже добавлена в избранное"); window.location.href = "/";</script>');
      }
  
      await FavoriteItem.create({ userId, riverId });
      res.redirect('/');
    } catch (error) {
      console.error(error);
      return res.send('<script>alert("Ошибка при добавлении в избранное"); window.location.href = "/";</script>');
    }
  });
  
  router.post('/favorites/remove', isAuthenticated, async (req, res) => {
    const { riverId } = req.body;
    const userId = req.session.user.id;
    
    try {
      await FavoriteItem.destroy({ where: { userId, riverId } });
      res.redirect(req.headers.referer || '/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Ошибка при удалении из избранного');
      return res.send('<script>alert("Ошибка при удалении из избранного"); window.location.href = "/";</script>');
    }
  });

module.exports = router;
