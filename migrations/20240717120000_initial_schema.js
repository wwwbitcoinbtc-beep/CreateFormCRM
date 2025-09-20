exports.up = function(knex) {
  return knex.schema
    // 1. Users table
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username').notNullable().unique();
      table.string('password').notNullable();
      table.string('fullName');
      table.string('role');
      table.json('accessibleMenus');
      table.timestamps(true, true);
    })
    // 2. Customers table
    .createTable('customers', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('customerCode').unique();
      table.string('type');
      table.string('status');
      table.json('mobileNumbers');
      table.json('emails');
      table.string('nationalId');
      table.string('economicCode');
      table.string('registrationNumber');
      table.string('country');
      table.string('province');
      table.string('city');
      table.string('address');
      table.string('postalCode');
      table.json('phone');
      table.string('website');
      table.text('notes');
      table.timestamps(true, true);
    })
    // 3. Purchase Contracts table (MODIFIED - No Products)
    .createTable('purchase_contracts', function(table) {
      table.increments('id').primary();
      table.integer('customerId').unsigned().references('id').inTable('customers').onDelete('CASCADE');
      table.text('service_description').notNullable(); // Flexible description of the service/item sold
      table.string('contractNumber').unique();
      table.date('startDate');
      table.date('endDate');
      table.decimal('price', 15, 2);
      table.string('paymentStatus');
      table.timestamps(true, true);
    })
    // 4. Support Tickets table
    .createTable('support_tickets', function(table) {
      table.increments('id').primary();
      table.integer('customerId').unsigned().references('id').inTable('customers').onDelete('CASCADE');
      table.string('subject');
      table.text('description');
      table.string('status');
      table.string('priority');
      table.integer('assignedTo').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.timestamps(true, true);
    })
    // 5. Activity Log table
    .createTable('activity_log', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.string('action_type').notNullable();
      table.json('details');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // 6. Tasks table
    .createTable('tasks', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description');
      table.string('status').defaultTo('pending');
      table.string('priority').defaultTo('medium');
      table.integer('assigned_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.integer('assigned_to').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.integer('customer_id').unsigned().references('id').inTable('customers').onDelete('CASCADE');
      table.date('due_date');
      table.timestamps(true, true);
    })
    // 7. Time Entries table
    .createTable('time_entries', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('task_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE');
      table.integer('ticket_id').unsigned().references('id').inTable('support_tickets').onDelete('CASCADE');
      table.dateTime('start_time').notNullable();
      table.dateTime('end_time');
      table.text('notes');
      table.timestamps(true, true);
    })
    // 8. AI Analysis Reports table
    .createTable('ai_analysis_reports', function(table) {
      table.increments('id').primary();
      table.string('report_name').notNullable();
      table.json('source_data_summary');
      table.json('analysis_result').notNullable();
      table.timestamps(true, true);
    })
    // 9. Notifications table
    .createTable('notifications', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('type').notNullable();
      table.text('body').notNullable();
      table.string('link_url');
      table.boolean('is_read').defaultTo(false);
      table.timestamps(true, true);
    })
    // 10. Attachments table
    .createTable('attachments', function(table) {
      table.increments('id').primary();
      table.string('file_name').notNullable();
      table.string('file_path').notNullable();
      table.string('file_type');
      table.integer('file_size');
      table.integer('uploaded_by_user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      table.integer('related_id').notNullable();
      table.string('related_type').notNullable();
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('attachments')
    .dropTableIfExists('notifications')
    .dropTableIfExists('ai_analysis_reports')
    .dropTableIfExists('time_entries')
    .dropTableIfExists('tasks')
    .dropTableIfExists('activity_log')
    .dropTableIfExists('support_tickets')
    .dropTableIfExists('purchase_contracts')
    .dropTableIfExists('customers')
    .dropTableIfExists('users');
};
