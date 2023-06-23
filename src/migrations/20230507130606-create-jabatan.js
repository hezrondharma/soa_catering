'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jabatan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type :  Sequelize.STRING,
        allowNull : false,      
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('jabatan');
  }
};