const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const sequelize = require('./database');
const authRoutes = require('./routes/authRoutes');
const riverRoutes = require('./routes/riverRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

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
