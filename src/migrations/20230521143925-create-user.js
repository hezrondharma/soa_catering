'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      no_telp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_jabatan: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_use : {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue : 0,
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
    await queryInterface.dropTable('users');
  }
};