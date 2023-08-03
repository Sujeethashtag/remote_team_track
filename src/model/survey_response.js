const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Branch = sequelize.define(
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
        type: DataTypes.ENUM('0', '1'),
      },
    },
    {
      tableName: "survey_response",
      createdAt: "created_at",
      updatedAt: "updated_at",
      timestamps: true,
    }
  );

  return Branch;
};
