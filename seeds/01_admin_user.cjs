const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Hash the password
      return bcrypt.hash('12345', saltRounds);
    })
    .then(function(hashedPassword) {
      // Inserts a seed entry with the hashed password
      return knex('users').insert([
        {
          username: 'admin',
          password: hashedPassword, 
          firstName: 'Admin',
          lastName: 'User',
          role: 'مدیر', 
          accessibleMenus: JSON.stringify(['*']) 
        }
      ]);
    });
};
