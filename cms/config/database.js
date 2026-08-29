module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: parseInt(env('DATABASE_PORT', '5432'), 10),
      database: env('DATABASE_NAME', 'tehrani_cms'),
      user: env('DATABASE_USERNAME', 'postgres'),
      password: env('DATABASE_PASSWORD', 'postgres'),
      ssl: false,
    },
    pool: { min: 0, max: 10 },
    debug: false,
  },
});