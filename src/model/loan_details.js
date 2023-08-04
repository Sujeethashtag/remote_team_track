const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const LoanDetails = sequelize.define(
    "loan_details",
    {
      executive_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      loan_account_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
      },
      city: {
        type: DataTypes.STRING,
      },
      bank_branch: {
        type: DataTypes.INTEGER,
      },
      bom_dpd: {
        type: DataTypes.INTEGER,
      },
      loan_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total_overdue_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      current_pos: {
        type: DataTypes.STRING,
      },
      remaining_turnover_required: {
        type: DataTypes.FLOAT,
      },
      sma_tagging: {
        type: DataTypes.STRING,
      },
      product_type: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: "Active", // Set default value to 'Active' if not provided
      },
    },
    {
      tableName: "loan_details",
      createdAt: "created_at",
      updatedAt: "updated_at",
      timestamps: true,
    }
  );

  return LoanDetails;
};

