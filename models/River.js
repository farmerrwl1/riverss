const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class River extends Model {}

River.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  length: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'River'
});

module.exports = River;
