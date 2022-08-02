export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '7397aac2b264b067a86b9d385a97375f'),
  },
});
