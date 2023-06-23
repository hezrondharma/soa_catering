'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jabatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.User, {foreignKey : 'id_jabatan'});
    }
  }
  Jabatan.init({
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
    modelName: 'Jabatan',
    tableName : 'jabatan',
  });
  return Jabatan;
};