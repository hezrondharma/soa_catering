'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingMenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Menu, {foreignKey : 'menu_id'});
      this.belongsTo(models.Booking, {foreignKey : 'booking_id'});
    }
  }
  BookingMenu.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    booking_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    menu_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    jumlah: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    timestamps : false,
    modelName: 'BookingMenu',
    tableName : 'booking_menu'
  });
  return BookingMenu;
};