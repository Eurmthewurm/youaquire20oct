'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessOwner extends Model {
    static associate(models) {
      BusinessOwner.hasMany(models.Client, { foreignKey: 'businessOwnerId' });
    }
  }
  BusinessOwner.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'BusinessOwner',
    tableName: 'BusinessOwners',
  });
  return BusinessOwner;
};
