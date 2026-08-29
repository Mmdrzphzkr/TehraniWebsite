module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: parseInt(env('PORT', '1337'), 10),
  app: {
    keys: env.array('APP_KEYS', [
      'tehrani-app-key-a',
      'tehrani-app-key-b',
      'tehrani-app-key-c',
      'tehrani-app-key-d',
    ]),
  },
});
