'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Discount.init({
    id: {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true,
      allowNull : false,
    },
    nama: {
      type : DataTypes.STRING,
      allowNull : false,
    },
    type : {
      type : DataTypes.STRING,
      allowNull : false,
    },
    amount : {
      type : DataTypes.INTEGER,
      allowNull : false,
    },
    expiredAt : {
      type : DataTypes.DATE,
      allowNull : false,
    },
  }, {
    sequelize,
    modelName: 'Discount',
    tableName : 'discounts',
    timestamps : true,
  });
  return Discount;
};