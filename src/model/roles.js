const { Sequelize, DataTypes} = require('sequelize');


module.exports = (sequelize)=>{
  const Role = sequelize.define('roles', {
    name: {
      type: DataTypes.ENUM('0', '1', '2', '3'),
      allowNull: true,
    },
    permission : {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
      status:{
        type: DataTypes.ENUM('0', '1'),
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
