const db = require("../model/index");
const Country = db.country;
const State = db.state;

const countryList = async (req, res) => {
  try {
    const countryData = await Country.findAll({
      where: {
        code: "IN",
      },
    });
    return res.json({
      status: true,
      message: "Country List",
      data: countryData,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};
const stateList = async (req, res) => {
  try {
    const stateData = await State.findAll({
      where: {
        country_code: "IN",
      },
    });
    return res.json({
      status: true,
      message: "state List",
      data: stateData,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

const branchAdd = async (req, res) => {
  try {
    const {
      branch_code,
      name,
      address,
      country,
      state,
      city,
      zipcode,
      status,
    } = req.body;
    let newBranch = await Branch.create({
      branch_code,
      name,
      address,
      country,
      state,
      city,
      zipcode,
      status,
    });

    return res.json({
      status: true,
      message: "Add new branch",
      data: newBranch,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
      data: stateData,
    });
  }
};

module.exports = {
  countryList,
  stateList,
  branchAdd,
};
