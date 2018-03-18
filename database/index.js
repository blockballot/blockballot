const Sequelize = require('sequelize');
const sequelize = new Sequelize('blockballot', 'root', '' , { // in mysql create databases blockballot
  dialect: 'mysql'
});

sequelize.authenticate().then(() => {
  console.log('MySQL Connection has been established successfully.');
}).catch(err => {
  console.error('MySQL Unable to connect to the database:', err);
});

const Org = sequelize.define('org', {        
  orgId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  orgName: {
    type: Sequelize.STRING
  },
  orgPassword: {
    type: Sequelize.STRING
  },
  orgEmail: {
    type: Sequelize.STRING
  }
});

const Poll = sequelize.define('poll', {        
  pollId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  pollName: {
    type: Sequelize.STRING
  },
  pollTimeStart: {
    type: Sequelize.DATE
  },
  pollTimeEnd: {
    type: Sequelize.DATE
  }
});

const Option = sequelize.define('option', {        
  optionId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  optionName: {
    type: Sequelize.STRING
  }
});

const Voter = sequelize.define('voter', {        
  voterId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  voterUniqueId: {
    type: Sequelize.STRING
  }
});

Org.hasMany(Poll, {as: 'Polls'});
Poll.hasMany(Option, {as: 'Options'});
