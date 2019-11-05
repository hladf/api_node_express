const dsn = process.env.DEV_ENV ? '' : process.env.SENTRY_DSN;
export default {
  dsn,
};
