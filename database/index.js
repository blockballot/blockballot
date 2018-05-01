const Sequelize = require("sequelize");
const sequelize = new Sequelize("blockballot", "root", "", {
  // in mysql create databases blockballot
  dialect: 'mysql',
  dialectOptions: {
    insecureAuth: true
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("MySQL Unable to connect to the database:", err);
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
  },
  createdAt: {
    type: Sequelize.DATE(3),
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
  },
  updatedAt: {
    type: Sequelize.DATE(3),
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(3)")
  },
  resetToken: {
    type: Sequelize.STRING,
    allowNull: true
  },
  resetExpiration: {
    type: Sequelize.DATE,
    allowNull: true
  }
});

const Poll = sequelize.define("poll", {
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
  },
  pollExpired: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE(3),
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
  },
  updatedAt: {
    type: Sequelize.DATE(3),
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
  }
});

const Option = sequelize.define('option', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  optionName: {
    type: Sequelize.STRING,
  },
  voteCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: Sequelize.DATE(3),
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
  },
  updatedAt: {
    type: Sequelize.DATE(3),
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
  }
});

const Vote = sequelize.define("vote", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  voteHash: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: 'TIMESTAMP', 
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
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
  },
  createdAt: {
    type: 'TIMESTAMP', 
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
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
VoteKey.hasOne(Vote);
sequelize.sync();

module.exports = {
  Org: Org,
  Poll: Poll,
  Option: Option,
  Vote: Vote,
  VoteKey: VoteKey,
  sequelize: sequelize
};
