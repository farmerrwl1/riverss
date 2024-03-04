const Sequelize = require('sequelize');

const sequelize = new Sequelize('rivers_l5s4', 'rivers', 'tS7ysQmikJboudKy86ffJu0Ys0MugqTu', {
  host: 'dpg-cnimp95jm4es738o2he0-a',
  dialect: 'postgres',
  port: 5432,
});

module.exports = sequelize;
