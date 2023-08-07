const db = require("../model/index");
const {Op} = require('sequelize');
const LoanDetails = db.loan_details;
const Task = db.tasks;
const User = db.user;
const Branch = db.branches

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
        include: [
            {
             attributes: ['name'],
              model: Branch,
            },
          ],
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

const taskView = async (req, res)=>{
    try{
       
        const loadData = await LoanDetails.findOne({
            include: [
                {
                 attributes: ['name'],
                  model: Branch,
                },
              ],
            where:{
                id:req.params.id
            }
        })
        return res.json({
            status: true,
            message: "Task details",
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
listOfTask,
taskView
};
