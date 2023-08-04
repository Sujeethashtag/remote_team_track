const { Sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize)=>{
  const Task = sequelize.define('tasks', {
    task_id: {
      type: DataTypes.INTEGER
    },
    assignee : {
      type: DataTypes.INTEGER
    },
      status:{
        type: DataTypes.BOOLEAN
      },
      survey_form_response_id : {
        type: DataTypes.INTEGER
      }

  },{
    tableName: 'tasks',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timestamps: true,
  });

  return Task
}
