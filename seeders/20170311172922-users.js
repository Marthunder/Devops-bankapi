'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('User', [
      {
        email: 'alexandre.marty@ynov.com',
        firstName: 'Alexandre',
        lastName: 'Marty',
        balance: 300
      },
      {
        email: 'remy.jallan@ynov.com',
        firstName: 'Rémy',
        lastName: 'Jallan',
        balance: 300
      },
      {
        email: 'quentin.rubini@ynov.com',
        firstName: 'Quentin',
        lastName: 'Rubini',
        balance: 300
      },
      {
        email: 'jack.prevert@ynov.com',
        firstName: 'Jack',
        lastName: 'Prevert',
        balance: 300
      },
      {
        email: 'jean.dupont@ynov.com',
        firstName: 'Jean',
        lastName: 'Dupont',
        balance: 300
      },
      {
        email: 'marion.dupont@ynov.com',
        firstName: 'Marion',
        lastName: 'Dupont',
        balance: 300
      },
      {
        email: 'jean.martin@ynov.com',
        firstName: 'Jean',
        lastName: 'Martin',
        balance: 300
      },
      {
        email: 'martine.pin@ynov.com',
        firstName: 'Martine',
        lastName: 'Pin',
        balance: 300
      },
      {
        email: 'pierre.caillou@ynov.com',
        firstName: 'Pierre',
        lastName: 'Caillou',
        balance: 300
      },
      {
        email: 'gilles.pin@ynov.com',
        firstName: 'Gilles',
        lastName: 'Pin',
        balance: 300
      }], {});

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('User', null, {}).then(function(){
      return queryInterface.bulkDelete('Operation', null, {})
    });
  }
};
