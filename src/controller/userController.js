const db = require("../model/index");
const bcrypt = require("bcrypt");
const xlsx = require("xlsx");
const csv = require("csv");
const fs = require("fs");
const csvParser = require("csv-parser");
const User = db.user;
const Transporter = require("../helper/sendmail");
const ejs = require("ejs");
const jwt = require('jsonwebtoken');

// Insert User
const addUser = async (req, res) => {
  try {
    const {
      name,
      email,
      contact_number,
      branch_id_mapping,
      gender,
      address,
      country,
      state,
      city,
      zipcode,
      status,
    } = req.body;
    const profile_image = req.file.path;
    const verifyPhone = await User.findOne({where:{contact_number,status:'1'}})
    if(verifyPhone)
    {
      return res.json({
        status: true,
        message: "Please enter new contact number",
      });
    }
    const user = await User.create({
      name,
      email,
      contact_number,
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
      status:'1',
    });

    const userData = await User.findOne({
      where: { email },
    });
    const secretKey = 'urieyw4y67238987453ygth'; // Replace with your secret key
    const payload = {
      userId: userData.id,
      username: userData.email
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    userData.reset_password_token = token;
    userData.reset_password_expires = new Date(Date.now() + 3600000); // 1 hour from now
    await userData.save();
    const emailData = await ejs.renderFile(
      "./src/helper/password_templete.ejs",
      {
        resetLink: `http://localhost:3000/set-password/${token}`,
      }
    );
    Transporter.transporter.sendMail({
      from: "info@easyrfq.com",
      to: email,
      subject: "Set Password",
      html: emailData,
    });
    return res.json({
      status: true,
      message: "User added successfully! Please check your email to set a password.",
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

const userProfileUpdate = async (req, res) => {
  try{
    const {
      name,
      gender,
      profile_image,
      address,
      country,
      state,
      city,
      zipcode,
    } = req.body;
    const user_id = req.userData.id
    const data = await User.update({
      name,
      gender,
      profile_image,
      address,
      country,
      state,
      city,
      zipcode,
    },{
      where:{id:user_id},
    })
    return res.json({
      status: true,
      message: "Profile update successfully",
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
  userProfile,
  userProfileUpdate
};
