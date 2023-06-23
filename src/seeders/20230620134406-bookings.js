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
    await queryInterface.bulkInsert('booking', [
      {
        nama: "Sample Event 1",
        tempat: "Sample Place 1",
        participant: 420,
        email: "sample@mail.com",
        no_telp: "081333444555",
        date_time: "2055-08-14",
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('booking', null, {truncate : true, cascade : true});
  }
};
