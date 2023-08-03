const { Sequelize, DataTypes} = require('sequelize');


module.exports = (sequelize)=>{
  const Country = sequelize.define('countries', {
    code: {
      type: DataTypes.STRING,
    },
    name : {
      type: DataTypes.STRING,
    }
  },{
    tableName: 'countries',
    timestamps: false
});

  return Country
}
