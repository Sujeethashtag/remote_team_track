const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Reason = sequelize.define(
    "reasons",
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
      tableName: "reasons",
      createdAt: "created_at",
      updatedAt: "updated_at",
      timestamps: true,
    }
  );

  return Reason;
};
