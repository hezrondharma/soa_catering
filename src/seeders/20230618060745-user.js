'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("users", [
      {
        username: "lorem",
        password: "123",
        email: "lorem@mail.com",
        nama: "Lorem Ipsum",
        no_telp: "081222333444",
        id_jabatan: 3,
        total_use : 0,
      },
      {
        username: "john",
        password: "123",
        email: "john@mail.com",
        nama: "John Doe",
        no_telp: "081222333444",
        id_jabatan: 1,
        total_use : 0,
      },
    ]); 
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {truncate : true, cascade : true});

  }
};
