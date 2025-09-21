
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary();
      table.string('firstName', 255).notNullable();
      table.string('lastName', 255).notNullable();
      table.string('username', 255).notNullable().unique();
      table.string('password', 255);
      table.string('role', 50).notNullable();
      table.text('accessibleMenus').notNullable(); // Stored as JSON string
    })
    .createTable('customers', function (table) {
      table.increments('id').primary();
      table.string('firstName', 255).notNullable();
      table.string('lastName', 255).notNullable();
      table.string('nationalId', 20).unique();
      table.string('birthDate', 20);
      table.string('gender', 10);
      table.string('maritalStatus', 20);
      table.text('mobileNumbers'); // JSON string
      table.text('emails'); // JSON string
      table.text('phone'); // JSON string
      table.text('address');
      table.string('jobTitle', 255);
      table.string('companyName', 255).notNullable();
      table.string('activityType', 255);
      table.string('taxCode', 50);
      table.string('bankAccountNumber', 50);
      table.string('iban', 50);
      table.text('paymentMethods'); // JSON string
      table.decimal('remainingCredit', 14, 2).defaultTo(0);
      table.string('softwareType', 50);
      table.string('purchaseDate', 20);
      table.string('supportStartDate', 20);
      table.string('supportEndDate', 20);
      table.string('level', 10);
      table.string('status', 20);
    })
    .createTable('purchase_contracts', function (table) {
        table.increments('id').primary();
        table.string('contractId', 50).notNullable().unique();
        table.string('contractStartDate', 20);
        table.string('contractEndDate', 20);
        table.string('contractDate', 20);
        table.string('contractType', 50);
        table.string('contractStatus', 50);
        table.string('softwareVersion', 50);
        table.string('customerType', 50);
        table.string('customerName', 255);
        table.string('economicCode', 50);
        table.text('customerAddress');
        table.string('customerContact', 255);
        table.string('customerRepresentative', 255);
        table.string('vendorName', 255);
        table.string('salesperson', 255);
        table.string('softwareName', 255);
        table.integer('licenseCount').defaultTo(1);
        table.text('softwareDescription');
        table.string('platform', 255);
        table.string('networkSupport', 10);
        table.string('webMobileSupport', 255);
        table.text('initialTraining');
        table.text('setupAndInstallation');
        table.text('technicalSupport');
        table.text('updates');
        table.text('customizations');
        table.decimal('totalAmount', 14, 2).defaultTo(0);
        table.decimal('prepayment', 14, 2).defaultTo(0);
        table.text('paymentStages');
        table.text('paymentMethods'); // JSON string
        table.string('paymentStatus', 50);
        table.string('invoiceNumber', 50);
        table.string('signedContractPdf', 255);
        table.string('salesInvoice', 255);
        table.string('deliverySchedule', 255);
        table.string('moduleList', 255);
        table.text('terminationConditions');
        table.text('warrantyConditions');
        table.text('ownershipRights');
        table.text('confidentialityClause');
        table.text('nonCompeteClause');
        table.text('disputeResolution');
        table.string('lastStatusChangeDate', 20);
        table.string('crmResponsible', 255);
        table.text('notes');
        table.text('futureTasks');
    })
    .createTable('support_contracts', function (table) {
        table.increments('id').primary();
        table.integer('customerId').unsigned().references('id').inTable('customers').onDelete('SET NULL');
        table.string('startDate', 20);
        table.string('endDate', 20);
        table.string('duration', 50);
        table.text('supportType'); // JSON string
        table.string('level', 50);
        table.string('status', 50);
        table.string('organizationName', 255);
        table.string('contactPerson', 255);
        table.string('contactNumber', 50);
        table.string('contactEmail', 255);
        table.string('economicCode', 50);
        table.text('fullAddress');
        table.string('softwareName', 255);
        table.string('softwareVersion', 50);
        table.string('initialInstallDate', 20);
        table.string('installType', 255);
        table.string('userCount', 50);
        table.string('softwareType', 50);
    })
    .createTable('tickets', function (table) {
        table.increments('id').primary();
        table.string('ticketNumber', 50).notNullable().unique();
        table.string('title', 255).notNullable();
        table.text('description');
        table.integer('customerId').unsigned().references('id').inTable('customers').onDelete('CASCADE');
        table.string('creationDateTime', 30);
        table.string('lastUpdateDate', 30);
        table.string('status', 50);
        table.string('priority', 50);
        table.string('type', 50);
        table.string('channel', 50);
        table.string('assignedTo', 255);
        table.text('attachments'); // JSON string
        table.timestamp('editableUntil').notNullable();
        table.string('workSessionStartedAt');
        table.integer('totalWorkDuration').defaultTo(0);
    })
    .createTable('ticket_updates', function (table) {
        table.increments('id').primary();
        table.integer('ticket_id').unsigned().notNullable().references('id').inTable('tickets').onDelete('CASCADE');
        table.string('author', 255);
        table.string('date', 30);
        table.text('description');
        table.integer('timeSpent'); // in minutes
    })
    .createTable('referrals', function (table) {
        table.increments('id').primary();
        table.integer('ticket_id').unsigned().notNullable().references('id').inTable('tickets').onDelete('CASCADE');
        table.string('referredBy', 255);
        table.string('referredTo', 255);
        table.timestamp('referralDate').notNullable();
    })
    .createTable('attendance_records', function (table) {
        table.increments('id').primary();
        table.integer('userId').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.timestamp('timestamp').notNullable();
        table.string('type', 20);
    })
    .createTable('leave_requests', function (table) {
        table.increments('id').primary();
        table.integer('userId').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.string('leaveType', 20);
        table.string('startDate', 20);
        table.string('endDate', 20);
        table.string('startTime', 10);
        table.string('endTime', 10);
        table.text('reason');
        table.string('status', 30);
        table.timestamp('requestedAt').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('leave_requests')
    .dropTableIfExists('attendance_records')
    .dropTableIfExists('referrals')
    .dropTableIfExists('ticket_updates')
    .dropTableIfExists('tickets')
    .dropTableIfExists('support_contracts')
    .dropTableIfExists('purchase_contracts')
    .dropTableIfExists('customers')
    .dropTableIfExists('users');
};
