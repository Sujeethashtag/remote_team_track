const db = require("../model/index");
const LoanDetails = db.loan_details;
const Task = db.tasks;
const User = db.user;
const Survey = db.survey_response

const surveyAdd = async (req, res)=>{
   try{
     const {
        task_id,
        reason_id,
        followup_date,
        visit_date_time,
        client_photo,
        user_photo,
        person_contacted,
        other_contacted,
        promise_amount,
        visit_mode,
        status,
  } = req.body
   const user_id = req.userData.id
    const add = await Survey.create({
          task_id,
          user_id,
          reason_id,
          followup_date,
          visit_date_time,
          client_photo,
          user_photo,
          person_contacted,
          other_contacted,
          promise_amount,
          visit_mode,
          status,
    })
    return res.json({
        status: true,
        message: "Add Successfully !",
        data:add
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
    surveyAdd
};
