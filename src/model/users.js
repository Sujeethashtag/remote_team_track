const { Sequelize, DataTypes } = require("sequelize");
var jwt = require("jsonwebtoken");
const config = require("../config/secret");


module.exports = (sequelize) => {
  const User = sequelize.define(
    "users",
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      contact_number: {
        type: DataTypes.STRING(199),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      branch_id_mapping: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: true,
      },
      profile_image: {
        type: DataTypes.TEXT,
        allowNull: true,
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
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
      timestamps: true,
    }
  );
  User.getAuth = (user) => {
    return jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.contact_number,
        role: user.role_id,
      },
      config.secret,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      }
    );
  };
  User.verifyToken = (token, callback) => {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        callback(null); // Invalid token, return null
      } else {
        callback(decoded); // Token is valid, return the decoded data
      }
    });
  };
  return User;
};
