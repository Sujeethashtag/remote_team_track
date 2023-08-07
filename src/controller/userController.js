const db = require("../model/index");
const bcrypt = require("bcrypt");
const xlsx = require("xlsx");
const csv = require("csv");
const fs = require("fs");
const csvParser = require("csv-parser");
const User = db.user;

// Insert User
const addUser = async (req, res) => {
  try {
    const {
      name,
      email,
      contact_number,
      role_id,
      parent_id,
      branch_id_mapping,
      gender,
      profile_image,
      address,
      country,
      state,
      city,
      zipcode,
      status,
    } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);
    const user = await User.create({
      name,
      email,
      contact_number,
      password,
      role_id: 2,
      parent_id: req.userData.id,
      branch_id_mapping,
      gender,
      profile_image,
      address,
      country,
      state,
      city,
      zipcode,
      status,
    });
    return res.json({
      status: true,
      message: "User Add Successfully",
      data: user,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

const userList = async (req, res) => {
  try {
    const list = await User.findAll({
      where: {
        parent_id: req.userData.id,
        role_id: 2,
      },
    });
    return res.json({
      message: "User listing",
      users: list,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

const userDetails = async (req, res) => {
  try {
    const list = await User.findOne({
      where: {
        id:req.params.id,
        parent_id: req.userData.id,
        role_id: 2,
      },
    });
    return res.json({
      message: "User Details",
      users: list,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

const userUpdate = async (req, res) => {
  try {
    let id = req.params.id;

    const {
      name,
      email,
      contact_number,
      role_id,
      branch_id_mapping,
      gender,
      profile_image,
      address,
      country,
      state,
      city,
      zipcode,
      status,
    } = req.body;

    const update = await User.update(
      {
        name,
        email,
        contact_number,
        role_id,
        branch_id_mapping,
        gender,
        profile_image,
        address,
        country,
        state,
        city,
        zipcode,
        status,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (update[0] > 0) {
      return res.json({
        status: true,
        message: "User update successfully",
      });
    } else {
      return res.json({
        status: false,
        message: "Something went wrong",
      });
    }
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};
//bulk subUser insert
const bulkUserAdd = async (req, res) => {
  try {
    const filePath = req.file.path;

    if (filePath.endsWith(".xlsx")) {
      const workbook = xlsx.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(worksheet);

      await User.bulkCreate(data);
    } else if (filePath.endsWith(".csv")) {
      const results = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => results.push(row))
        .on("end", async () => {
          await User.bulkCreate(results);
        });
    } else {
      return res.status(400).send("Unsupported file format.");
    }

    return res.status(200).send("Data inserted successfully.");
  } catch (error) {
    console.error("Error uploading and inserting data:", error);
    return res.status(500).send("Error uploading and inserting data.");
  }
};

const userProfile = async (req, res) => {
  try{
    const user_id = req.userData.id
    const data = await User.findOne({
      where:{id:user_id},
    })
    return res.json({
      status: true,
      message: "User Profile",
      data
    });
  }catch(err)
  {
    return res.json({
      status: false,
      message: err.message,
    });
  }
}

module.exports = {
  addUser,
  userList,
  userUpdate,
  bulkUserAdd,
  userDetails,
  userProfile
};
