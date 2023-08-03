const { Sequelize, DataTypes} = require('sequelize');


module.exports = (sequelize)=>{
  const Role = sequelize.define('roles', {
    name: {
      type: DataTypes.STRING,
    },
      status:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
      }

  },{
    tableName: 'roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true,
  });

  return Role
}
