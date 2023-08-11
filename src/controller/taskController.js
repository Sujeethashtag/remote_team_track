const db = require("../model/index");
const { Op } = require("sequelize");
const LoanDetails = db.loan_details;
const Task = db.tasks;
const User = db.user;
const Branch = db.branches;

const listOfTask = async (req, res) => {
  try {
    const status_code = req.params.status;
    let where = {};
    if (status_code == 3) {
      const toDateObj = new Date();
      toDateObj.setDate(toDateObj.getDate() + 1);
      const to_date = toDateObj.toISOString().split("T")[0];
      const today = new Date().toISOString().split("T")[0];

     where = {
        ...(status_code !== undefined ? { status: 1 } : {}),
        created_at: { [Op.between]: [today, to_date] },
        assignee: req.userData.id,
      };
    }
    else if (status_code == 4) {
        const toDateObj = new Date();
        toDateObj.setMonth(toDateObj.getMonth() - 1);
        const to_date = toDateObj.toISOString().split("T")[0];
        const today = new Date().toISOString().split("T")[0];
  
       where = {
        //   ...(status_code !== undefined ? { status: 1 } : {}),
          created_at: { [Op.between]: [to_date, today] },
          assignee: req.userData.id,
        };
      }
    else{
        where = {
            ...(status_code !== undefined ? { status: status_code } : {}),
            assignee: req.userData.id,
          };
    }
    const taskList = await Task.findAll({
      attributes: ["id", "task_id"],
      where: where,
    });
    const taskId = taskList.map((task) => task.task_id);

    const loadData = await LoanDetails.findAll({
      include: [
        {
          attributes: ["name"],
          model: Branch,
        },
      ],
      where: {
        id: {
          [Op.in]: taskId,
        },
      },
    });
    return res.json({
      status: true,
      message: "Task list",
      data: loadData,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

const taskView = async (req, res) => {
  try {
    const loadData = await LoanDetails.findOne({
      include: [
        {
          attributes: ["name"],
          model: Branch,
        },
      ],
      where: {
        id: req.params.id,
      },
    });
    return res.json({
      status: true,
      message: "Task details",
      data: loadData,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = {
  listOfTask,
  taskView,
};
