'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('menu', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING,
        allowNull : false,
      },
      harga: {
        type: Sequelize.INTEGER,
        allowNull : false,
      },
      tipe: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      foto: {
        type: Sequelize.STRING,
        allowNull : true,
      },
      createdAt : {
        type : Sequelize.DATE,
        defaultValue : Sequelize.fn('NOW')
      },
      updatedAt : {
        type : Sequelize.DATE,
        defaultValue : Sequelize.fn('NOW')
      },
      deletedAt : {
        type : Sequelize.DATE,
        allowNull : true,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('menu');
  }
};