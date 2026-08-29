module.exports = async ({ strapi }) => {
  try {
    // Ensure 'request-admin' role exists (users-permissions plugin)
    const existing = await strapi.db.query('plugin::users-permissions.role').findMany({ where: { name: 'request-admin' } });
    if (!existing || existing.length === 0) {
      await strapi.db.query('plugin::users-permissions.role').create({ data: { name: 'request-admin', description: 'Request Admin with limited rights' } });
      strapi.log.info('Created role: request-admin');
    }

    // Log reminder to create Admin API token via Admin UI
    strapi.log.info('If not already created, please create an Admin API token named "frontend-readonly" from the Admin UI (Settings -> API Tokens) with read permissions for content-types.');
  } catch (err) {
    strapi.log.error('Bootstrap helper failed', err);
  }
};