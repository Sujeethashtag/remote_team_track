const db = require("../model/index");
const xlsx = require("xlsx");
const csv = require("csv");
const fs = require("fs");
const csvParser = require("csv-parser");
const LoanDetails = db.loan_details;
const Task = db.tasks;
const User = db.user;

const listOfTask = async (req, res)=>{
   try{
    const taskList = await Task.findAll({
        attributes: ['id'],
        include:[{
            model:LoanDetails
        }],
        where:{
            assignee:req.userData.id
        }
    })
    return res.json({
        status: true,
        message: "Task list",
        data:taskList
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
listOfTask
};
