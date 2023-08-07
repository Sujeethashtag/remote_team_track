const { Op } = require("sequelize");
const db = require("../model/index");
const { use } = require("../route");
const Excel = require("exceljs");
const LoanDetails = db.loan_details;
const Task = db.tasks;
const User = db.user;
const Survey = db.survey_response;
const Reason = db.reasons;
const Branch = db.branches;

const reasonList = async (req, res) => {
  try {
    const data = await Reason.findAll({
      where: {
        status: "1",
      },
    });
    return res.json({
      status: true,
      message: "Reason list",
      data,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

const surveyAdd = async (req, res) => {
  try {
    const {
      task_id,
      reason_id,
      response_json,
      followup_date,
      visit_date_time,
      person_contacted,
      other_contacted,
      promise_amount,
      visit_mode,
      status,
    } = req.body;
    // return res.json({data:req.body})
    const client_photo = req.files['client_photo'][0].path;
    const user_photo = req.files['user_photo'][0].path;
    const user_id = req.userData.id;
    const add = await Survey.create({
      task_id,
      user_id,
      reason_id,
      response_json,
      followup_date,
      visit_date_time,
      client_photo,
      user_photo,
      person_contacted,
      other_contacted,
      promise_amount,
      visit_mode,
      status,
    });
    return res.json({
      status: true,
      message: "Add Successfully !",
      data: add,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

const surveyExport = async (req, res) => {
  try {
    const data = await Survey.findAll({
      include: [
        {
          attributes: ["reason_text"],
          model: Reason,
        },
        {
          attributes: ["name"],
          model: User,
        },
        {
          attributes: ["task_id", "assignee"],
          model: Task,
          include: [
            {
              attributes: ["loan_account_number", "bank_branch"],
              model: LoanDetails,
              include: [
                {
                  attributes: ["name"],
                  model: Branch,
                },
              ],
            },
          ],
        },
      ],
      where: {
        created_at: { [Op.between]: [req.body.from_date, req.body.to_date] },
      },
    });

    const mapping = data.map((details) => {
      return {
        "A/c Number": details?.task?.loan_detail?.loan_account_number ? details?.task?.loan_detail?.loan_account_number : "",
        "Disposition code": details?.reason?.reason_text ? details?.reason?.reason_text : "",
        "Feedback/Remarks (Details Remark)": details?.response_json ? details?.response_json : "",
        "PTP Date/Next Visit Date": details?.followup_date ? details?.followup_date : "",
        "PTP Amount": details?.promise_amount ? details?.promise_amount : "",
        "Visit Date": details.created_at,
        "Executive Name": details?.user?.name ? details?.user?.name : "",
        "Branch Name": details?.task?.loan_detail?.branch?.name ? details?.task?.loan_detail?.branch?.name : "" ,
      };
    });

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("My Worksheet");

    // Add table headers
    const headerRow = worksheet.addRow(Object.keys(mapping[0]));
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    // Add table data
    mapping.forEach((row) => {
      worksheet.addRow(Object.values(row));
    });

    // Save the workbook
    await workbook.xlsx.writeFile("my-excel-file.xlsx");

    return res.json({
      status: true,
      message: "Export Data Successfully",
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

const surveyList = async (req, res) => {
  try {
    const fromDate = req.query.from_date;
    const toDate = req.query.to_date;
    let to_date = "";
    let from_date = "";
    if (fromDate && toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setDate(toDateObj.getDate() + 1);
      to_date = toDateObj.toISOString().split("T")[0];
      from_date = req.query.from_date;
    } else {
      to_date = new Date();
      from_date = new Date();
      from_date.setMonth(to_date.getMonth() - 1);
      to_date.setDate(to_date.getDate() + 1);
      to_date = to_date.toISOString().split("T")[0];

      from_date = from_date.toISOString().split("T")[0];
      console.log("To date", to_date, "From date", from_date);
    }
    const data = await Survey.findAll({
      include: [
        {
          attributes: ["reason_text"],
          model: Reason,
        },
        {
          attributes: ["name"],
          model: User,
        },
        {
          attributes: ["task_id", "assignee"],
          model: Task,
          include: [
            {
              attributes: ["loan_account_number", "bank_branch"],
              model: LoanDetails,
              include: [
                {
                  attributes: ["name"],
                  model: Branch,
                },
              ],
            },
          ],
        },
      ],
      where: {
        created_at: { [Op.between]: [from_date, to_date] },
      },
    });

    const mapping = data.map((details) => {
      return {
        "acc_number": details?.task?.loan_detail?.loan_account_number ? details?.task?.loan_detail?.loan_account_number : "",
        "disposition_code": details?.reason?.reason_text ? details?.reason?.reason_text : "",
        "feedback_remarks": details?.response_json ? details?.response_json : "",
        "followup_date": details?.followup_date ? details?.followup_date : "",
        "promise_amount": details?.promise_amount ? details?.promise_amount : "",
        "visit_date": details.created_at,
        "executive_name": details?.user?.name ? details?.user?.name : "",
        "branch_name": details?.task?.loan_detail?.branch?.name ? details?.task?.loan_detail?.branch?.name : "" ,
      };
    });

    return res.json({
      status: true,
      message: "Survey data list",
      data: mapping,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = {
  surveyAdd,
  reasonList,
  surveyList,
  surveyExport,
};
