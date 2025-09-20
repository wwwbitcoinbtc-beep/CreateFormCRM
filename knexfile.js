// Update this with your SQL Server connection details
const knexConfig = {
  development: {
    client: 'mssql',
    connection: {
      server: 'localhost',
      user: 'your_username',
      password: 'your_password',
      database: 'crmbackend',
      options: {
        encrypt: true, // Use this if you're on Azure
        trustServerCertificate: true // Change to false for production
      }
    },
    migrations: {
      directory: './migrations'
    }
  }
};

export default knexConfig;
