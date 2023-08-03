const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Branch = sequelize.define(
    "branches",
    {
        branch_code: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING(255),
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      zipcode: {
        type: DataTypes.STRING(11),
        allowNull: true,
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
