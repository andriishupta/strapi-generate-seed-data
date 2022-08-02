export const SEED_USERNAME = 'seed_user'

/**
 * Using Users collection as main indicator if we have generated seed data before
 */
export const seedUserExists = async (strapi: Strapi.Strapi) => {
  const [seedUser] = await strapi.entityService.findMany('plugin::users-permissions.user', {
    filters: {
      username: SEED_USERNAME
    }
  })
  return !!seedUser
}

/**
 * Creating user that will be an indicator for method `seedUserExists`
 *
 * cannot be used for login, such as lacks full functionality with JWT
 * for more info how to create valid user via API, checkout the source-code:
 * https://github.com/strapi/strapi/blob/master/packages/plugins/users-permissions/server/controllers/auth.js#L239
 */
export const createSeedUser = async (strapi: Strapi.Strapi) => {
  const now = Date.now()

  await strapi.entityService.create('plugin::users-permissions.user', {
    data: {
      username: SEED_USERNAME,
      password: `${ SEED_USERNAME }-${ now }`,
      email: `${ SEED_USERNAME }@test.com`,
      confirmed: true
    }
  })
}
