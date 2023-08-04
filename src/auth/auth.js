const jwt = require('jsonwebtoken');
const config = require('../config/secret');

const client = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).send({
        status: false,
        message: "Enter valid token !",
      });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.userData = decoded;
      next();
    });
  } catch (err) {
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

module.exports = {client};
