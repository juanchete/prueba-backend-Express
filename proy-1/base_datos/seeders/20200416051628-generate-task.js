'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('tasks', [{
        id: 1,
        description: 'GRABAR UN MOVIE',
        createdAt: new Date(),
        updatedAt: new Date(),
      }], {});

  },

  down: (queryInterface, Sequelize) => {


      return queryInterface.bulkDelete('tasks', null, {});

  }
};
