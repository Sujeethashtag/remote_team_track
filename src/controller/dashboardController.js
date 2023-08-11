const db = require("../model/index");
const User = db.user;
const LoanDetails = db.loan_details;
const Task = db.tasks;
const Country = db.country;
const State = db.state;
const Branch = db.branches;
const Survey = db.survey_response;

const userDashboard = async (req, res) => {
  try {
    const user_id = req.userData.id;
    const role_id = req.userData.role;
    if (role_id == 2) {
      const task = await Task.count({
        where: {
          assignee: user_id,
        },
      });
      const openTask = await Task.count({
        where: {
          status: 1,
          assignee: user_id,
        },
      });
      const closeTask = await Task.count({
        where: {
          status: 0,
          assignee: user_id,
        },
      });
      const followupTask = await Task.count({
        where: {
          status: 2,
          assignee: user_id,
        },
      });
      const task_data = {
        totalTaskCount: task,
        totalOpenTask: openTask,
        totalCloseTask: closeTask,
        totalFollowUpTask: followupTask,
      };
      return res.json({
        status: true,
        message: "Data List",
        data: task_data,
      });
    }
    return res.json({
      status: false,
      message: "Please Enter Valid User Email",
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};
const adminDashboard = async (req, res) => {
    try {
      const user_id = req.userData.id;
      const role_id = req.userData.role;
      if (role_id == 1) {
        const survey = await Survey.count({})
        const surveyClose = await Task.count({
            where:{
                status:0
            }
        })
        const totalTask = await Task.count({})
        const surveyOpen = await Task.count({
            where:{
                status:1
            }
        })
        const activeUser = await User.count({
            where:{
                status:1
            }
        })
        const followupTask = await Task.count({
            where: {
              status: 2,
            },
          });

        const data = {
            activeUsersCount:activeUser,
            totalSurvey :survey,
            totalTask:totalTask,
            closedTask:surveyClose,
            openTask:surveyOpen,
            followUpTasks:followupTask
        };
        return res.json({
          status: true,
          message: "Data List",
          data: data,
        });
      }
      return res.json({
        status: false,
        message: "Please Enter Valid User Email",
      });
    } catch (err) {
      return res.json({
        status: false,
        message: err.message,
      });
    }
  };


module.exports = {
  userDashboard,
  adminDashboard
};
