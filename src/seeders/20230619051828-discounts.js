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
    await queryInterface.bulkInsert('discounts', [
      {
        nama: "POTONGAN Sample",
        type : "POTONGAN",
        amount : 25000,
        expiredAt : '2023-11-23',
      },
      {
        nama: "Discount Sample",
        type : "DISKON",
        amount : 10,
        expiredAt : '2023-11-23',
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
    await queryInterface.bulkDelete('discounts', null, {truncate : true, cascade : true});
  }
};
