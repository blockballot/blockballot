const Sequelize = require('sequelize');
const sequelize = new Sequelize('user', 'root', '' , {
//   host: 'localhost',
//   port: 3000,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => {
    console.log('MySQL Connection has been established successfully.');
  })
  .catch(err => {
    console.error('MySQL Unable to connect to the database:', err);
  });



