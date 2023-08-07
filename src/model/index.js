const dbConfig = require('../config/db');
const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER,
dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	operationsAliases: false,
	pool: {
	max: dbConfig.pool.max,
	min: dbConfig.pool.min,
	acquire: dbConfig.pool.acquire,
	idle: dbConfig.pool.idle
	}
})
sequelize
  .authenticate()
  .then(() => {
    console.log("connected ....");
  })
  .catch((error) => {
    console.log("Error" + error);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./users")(sequelize, DataTypes);
db.role = require("./roles")(sequelize, DataTypes);
db.country = require("./country")(sequelize, DataTypes);
db.loan_details = require("./loan_details")(sequelize, DataTypes);
db.state = require("./state")(sequelize, DataTypes);
db.tasks = require("./tasks")(sequelize, DataTypes);
db.branches = require("./branches")(sequelize, DataTypes);
db.status = require("./status")(sequelize, DataTypes);
db.reasons = require("./reasons")(sequelize, DataTypes);
db.survey_response = require("./survey_response")(sequelize, DataTypes);
db.logins = require("./logins")(sequelize, DataTypes);


db.sequelize.sync({ force: false }).then(() => {
  console.log("re-sync done!");
});

db.tasks.belongsTo(db.loan_details, {
	foreignKey: 'task_id'
  });

  db.tasks.belongsTo(db.user, {
	foreignKey: 'assignee'
  });

db.survey_response.belongsTo(db.reasons, {
	foreignKey:'reason_id',
})

db.survey_response.belongsTo(db.tasks, {
	foreignKey:'task_id',
})
db.survey_response.belongsTo(db.user, {
	foreignKey:'user_id',
})
db.loan_details.belongsTo(db.branches, {
	foreignKey:'bank_branch',
})
db.loan_details.belongsTo(db.user, {
	foreignKey:'executive_id',
})

db.logins.belongsTo(db.user,{
	foreignKey:'user_id',
})
module.exports = db;
