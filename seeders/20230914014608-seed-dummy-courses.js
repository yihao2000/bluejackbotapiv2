'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define your dummy data for the dummy_courses table
    const dummyCoursesData = [
      {
        id: 'DUMMYCOURSE001',
        code: 'ISYS6197003',
        name: 'Business Application Development',
        credit: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'DUMMYCOURSE002',
        code: 'COMP6047001',
        name: 'Algorithm and Programming',
        credit: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'DUMMYCOURSE003',
        code: 'COMP6247001',
        name: 'Computer Networks',
        credit: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more dummy course data as needed
    ];

    // Use bulkInsert to insert the data into the table
    await queryInterface.bulkInsert('dummy_courses', dummyCoursesData, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the inserted data in case of a rollback
    await queryInterface.bulkDelete('dummy_courses', null, {});
  },
};
