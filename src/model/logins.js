const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Login = sequelize.define(
    "logins",
    {
      client_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      login_time: {
        type: DataTypes.TIME,
      },
      logout_time: {
        type: DataTypes.TIME,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      tableName: "logins",
      createdAt: "created_at",
      updatedAt: "updated_at",
      timestamps: true,
    }
  );

  return Login;
};
