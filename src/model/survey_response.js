const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Survey = sequelize.define(
    "survey_response",
    {
        task_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      reason_id: {
        type: DataTypes.INTEGER,
      },
      action_code: {
        type: DataTypes.STRING,
      },
      remark: {
        type: DataTypes.TEXT,
      },
      response_json: {
        type: DataTypes.TEXT,
      },
      followup_date: {
        type: DataTypes.DATE,
      },
      visit_date_time: {
        type: DataTypes.DATE,
      },
      client_photo: {
        type: DataTypes.STRING,
      },
      user_photo: {
        type: DataTypes.STRING,
      },
      person_contacted: {
        type: DataTypes.STRING,
      },
      other_contacted: {
        type: DataTypes.STRING,
      },
      promise_amount: {
        type: DataTypes.DECIMAL(12,2),
      },
      visit_mode: {
        type: DataTypes.ENUM('0', '1'),
      },
      status: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: "survey_response",
      createdAt: "created_at",
      updatedAt: "updated_at",
      timestamps: true,
    }
  );

  return Survey;
};
