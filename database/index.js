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

//test
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
Poll.hasMany(Option);
Org.hasMany(Poll);


Org.sync().then(() => {
  console.log('Org table created')
});
Poll.sync().then(() => {
  console.log('Poll table created')
});
Option.sync().then(() => {
  console.log('Option table created')
});
Voter.sync().then(() => {
  console.log('Voter table created')
});


module.exports = {
  checkVoter: (data) => {
    Voter.findOrCreate({where: {voterUniqueId: data}})
    .spread ((voter, created) => {
      console.log(voter.get({
        plain: true
      }))
    })
  },

  checkLogin: (user) => {

  },
  //check if user is already in the db during signup
  alreadyExists: (user) => {
    console.log('inside db func')
    return Org.count({ where: { orgEmail: user.username } })
      .then(count => {
        if (count === 0) {
          console.log('FALSE');
          return false;
        } else {
          return true;
        };
    });
  },
  //save org to db during signup
  saveOrg: (user) => {
    console.log('inside save');
    Org.create({orgName: user.name, orgEmail: user.username, orgPassword: user.password});
  },
}
