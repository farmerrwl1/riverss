const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');
const River = require('./River');

class FavoriteItem extends Model {}

FavoriteItem.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  riverId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'FavoriteItem'
});

FavoriteItem.belongsTo(River, { foreignKey: 'riverId', as: 'river', onDelete: 'CASCADE' });

module.exports = FavoriteItem;
