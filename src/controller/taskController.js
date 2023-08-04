const db = require("../model/index");
const {Op} = require('sequelize');
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
        attributes: ['id', 'task_id'],
        where:{
            assignee:req.userData.id
        }
    })
    const taskId = taskList.map((task) => task.task_id);

    const loadData = await LoanDetails.findAll({
        where:{
            id:{
                [Op.in]:taskId
            }
        }
    })
    return res.json({
        status: true,
        message: "Task list",
        data:loadData
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
