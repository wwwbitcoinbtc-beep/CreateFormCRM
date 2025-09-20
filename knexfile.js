import dotenv from 'dotenv';
dotenv.config();

const config = {
  development: {
    client: 'mssql',
    connection: {
      server: process.env.DB_SERVER || 'DESKTOP-T42H17N',
      user: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || '123',
      database: process.env.DB_DATABASE || 'crmbackend',
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
      }
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  },
};

export default config;
