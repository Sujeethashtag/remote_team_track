const db = require("../model/index");
const bcrypt = require("bcrypt");
const Transporter = require("../helper/sendmail");
const ejs = require("ejs");
const User = db.user;
const Role = db.role;
const Login = db.logins;

const userLogin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = User.getAuth(user); // Call the getAuth method on the User model instance
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    const loginAdd = await Login.create({
      client_id: user.parent_id,
      user_id: user.id,
      login_time: formattedTime,
      status: "1",
    });
    return res.status(200).json({
      status: true,
      message: "Login success",
      accessToken: token,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

const logout = async (req, res) => {
  const findLogin = await Login.findOne({
    where: {
      user_id: req.userData.id,
    },
    order: [["id", "DESC"]],
  });
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  const updateTime = await Login.update(
    {
      logout_time: formattedTime,
      status: 0,
    },
    {
      where: {
        id: findLogin.id,
      },
    }
  );
  res.clearCookie("token");
  return res.json({
    message: "logout",
  });
};

const passwordUpdate = async (req, res) => {
  try {
    const data = req.body;
    const match_password = await User.findOne({
      where: {
        id: data.id,
      },
    });
    const passwordIsValid = bcrypt.compareSync(
      data.old_password,
      match_password.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        status: false,
        message: "Invalid old password!",
      });
    }
    if (data.new_password !== data.confirm_password) {
      return res.status(401).send({
        status: false,
        message: "Password not match",
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(data.new_password, salt);
    const changePassword = await User.update(
      {
        password,
      },
      {
        where: {
          id: data.id,
        },
      }
    );
    if (changePassword[0] > 0) {
      return res.json({
        status: true,
        message: "Password update successfully",
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const userData = await User.findOne({
      where: { email },
    });
    if (!userData) {
      return res.status(404).json({
        status: false,
        message: "Please enter valid email !",
      });
    }
    const token = "randomly_generated_token";
    userData.reset_password_token = token;
    userData.reset_password_expires = new Date(Date.now() + 3600000); // 1 hour from now
    await userData.save();
    const emailData = await ejs.renderFile(
      "./src/helper/password_templete.ejs",
      {
        resetLink: `http://192.168.1.7:4000/api/reset-password/${token}`,
      }
    );

    Transporter.transporter.sendMail({
      from: "yadavsujeet391@gmail.com",
      to: email,
      subject: "hello world!",
      html: emailData,
    });
    return res.status(201).json({ message: "Send Mail" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const UserAttends = async (req, res)=>{
  try{
    const data = await Login.findAll({
      include:[{
        attributes:['name', 'email', 'contact_number'],
        model:User
      }]
    })
    return res.json({
      status: true,
      message:"user attendance list",
      data:data
    });
  }catch(err){
    return res.json({
      status: false,
      message: err.message,
    });
  }
}

module.exports = {
  userLogin,
  logout,
  passwordUpdate,
  forgotPassword,
  UserAttends
};
