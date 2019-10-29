module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'postgresdb',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
