'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MenuTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Menu, {foreignKey : 'tipe'});
    }
  }
  MenuTypes.init({
    id: {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true,
      allowNull : false,
    },
    nama: {
      type :  DataTypes.STRING,
      allowNull : false,
    }
  }, {
    sequelize,
    timestamps : false,
    modelName: 'MenuType',
    tableName : 'menu_types'
  });
  return MenuTypes;
};