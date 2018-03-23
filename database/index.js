const Sequelize = require('sequelize');
const sequelize = new Sequelize('blockballot', 'root', '' , {
// in mysql create databases blockballot
  dialect: 'mysql'
});

sequelize.authenticate().then(() => {
  console.log('MySQL Connection has been established successfully.');
}).catch(err => {
  console.error('MySQL Unable to connect to the database:', err);
});

const Org = sequelize.define('org', {
  id: {
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
  id: {
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
  },
  pollHash: {
    type: Sequelize.STRING
  }
});

const Option = sequelize.define('option', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  optionName: {
    type: Sequelize.STRING
  }
});

const Vote = sequelize.define('vote', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  voteHash: {
    type: Sequelize.STRING
  }
});

const VoteKey = sequelize.define('votekey', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  voterUniqueId: {
    type: Sequelize.STRING
  }
});

Poll.hasMany(Option);
Option.belongsTo(Poll);
Org.hasMany(Poll);
Poll.belongsTo(Org);
Option.hasMany(Vote);
Vote.belongsTo(Option);
Poll.hasMany(VoteKey);
VoteKey.belongsTo(Poll);

Org.sync().then(() => {
  console.log('Org table created');
});
Poll.sync().then(() => {
  console.log('Poll table created');
});
Option.sync().then(() => {
  console.log('Option table created');
});
Vote.sync().then(() => {
  console.log('Vote table created');
});
VoteKey.sync().then(() => {
  console.log('VoteKey table created');
})


module.exports = {
  Org: Org,
  Poll: Poll,
  Option: Option,
  Vote: Vote,
  VoteKey: VoteKey
}
