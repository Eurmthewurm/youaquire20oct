'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      Client.belongsTo(models.BusinessOwner, { foreignKey: 'businessOwnerId' });
    }
  }
  Client.init({
    youtubeUsername: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    businessOwnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'BusinessOwners',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};
