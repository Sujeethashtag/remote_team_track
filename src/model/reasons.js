const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Branch = sequelize.define(
    "branches",
    {
      reason_text: {
        type: DataTypes.STRING(355),
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      tableName: "branches",
      createdAt: "created_at",
      updatedAt: "updated_at",
      timestamps: true,
    }
  );

  return Branch;
};
