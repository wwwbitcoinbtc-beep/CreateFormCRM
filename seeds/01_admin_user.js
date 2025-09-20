الان exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts a seed entry
      return knex('users').insert([
        {
          username: 'admin',
          password: 'admin', // In a real application, this should be a hashed password
          fullName: 'Administrator',
          role: 'admin',
          accessibleMenus: JSON.stringify(['*']) // Full access
        }
      ]);
    });
};
