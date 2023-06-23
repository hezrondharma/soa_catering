'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.BookingMenu, {foreignKey : 'booking_id'});
    }
  }
  Booking.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama: {
      allowNull: false,
      type: DataTypes.STRING
    },
    tempat: {
      allowNull: false,
      type: DataTypes.STRING
    },
    participant: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    no_telp: {
      allowNull: false,
      type: DataTypes.STRING
    },
    date_time: {
      allowNull: false,
      type: DataTypes.DATE
    },
    id_diskon : {
      allowNull: true,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    timestamps : false,
    modelName: 'Booking',
    tableName : 'booking',
  });
  return Booking;
};