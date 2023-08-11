const db = require("../model/index");
const Country = db.country;
const State = db.state;
const Branch = db.branches

const countryList = async (req, res) => {
  try {
    const countryData = await Country.findAll({
      where: {
        code: "IN",
      },
    });
    return res.status(200).json({
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
    return res.status(200).json({
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

const barnchListing = async (req, res) =>{
  try{
    const branches=await Branch.findAll({});
    return res.status(200).json({
      status :true,
      message:"Branch listing",
      data   :branches
    })

  }catch(err){
    console.log("error");
  }
}

const barnchDetails = async (req, res) =>{
  try{
    const branches=await Branch.findOne({
      where:{
        id:req.params.id
      }
    });
    return res.status(200).json({
      status :true,
      message:"Branch Details",
      data   :branches
    })

  }catch(err){
    console.log("error");
  }
}

const branchUpdate = async (req, res) => {
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
    let updateBranch = await Branch.update({
      branch_code,
      name,
      address,
      country,
      state,
      city,
      zipcode,
      status,
    },{
      where:{
        id:req.params.id
      }
    });

    return res.json({
      status: true,
      message: "Updated branch",
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
  barnchListing,
  branchUpdate,
  barnchDetails
};
