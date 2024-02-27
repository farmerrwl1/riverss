const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const sequelize = require('./database');
const authRoutes = require('./routes/authRoutes');
const riverRoutes = require('./routes/riverRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

async function updateAdminUserRole() {
  try {
    // Находим пользователя с логином admin
    const adminUser = await User.findOne({ where: { username: 'admin' } });

    // Проверяем, найден ли пользователь
    if (!adminUser) {
      console.log('Пользователь с логином admin не найден');
      return;
    }

    // Обновляем роль пользователя на admin
    adminUser.role = 'admin';
    await adminUser.save();

    console.log('Роль пользователя с логином admin успешно изменена на admin');
  } catch (error) {
    console.error('Ошибка при изменении роли пользователя:', error);
  }
}

// Вызываем функцию для изменения роли пользователя
updateAdminUserRole();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(riverRoutes);
app.use(authRoutes);
app.use(adminRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
