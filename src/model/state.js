const { Sequelize, DataTypes} = require('sequelize');


module.exports = (sequelize)=>{
  const State = sequelize.define('country_states', {
    country_code: {
        type: DataTypes.STRING,
      },
    code: {
      type: DataTypes.STRING,
    },
    default_name : {
      type: DataTypes.STRING,
    }
  },{
    tableName: 'country_states',
    timestamps: false
});

  return State
}
