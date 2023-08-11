const db = require("../model/index");
const xlsx = require("xlsx");
const csv = require("csv");
const fs = require("fs");
const csvParser = require("csv-parser");
const LoanDetails = db.loan_details;
const Task = db.tasks;
const User = db.user;

const loanUpload = async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log(filePath);
    if (filePath.endsWith(".xlsx")) {
      const workbook = xlsx.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(worksheet);

      await LoanDetails.bulkCreate(data);
    } else if (filePath.endsWith(".csv")) {
      const results = [];
      
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          const loanData = {
            executive_id: row['executive_id'],
            loan_account_number: row['loan_account_number'],
            customer_name: row['customer_name'],
            mobile_no: row['mobile_no'],
            address: row['address'],
            city: row['city'],
            bank_branch: row['bank_branch'],
            bom_dpd: row['bom_dpd'],
            loan_amount: row['loan_amount'],
            total_overdue_amount: row['total_overdue_amount'],
            current_pos: row['current_pos'],
            remaining_turnover_required: row['remaining_turnover_required'],
            sma_tagging: row['sma_tagging'],
            product_type: row['product_type'],
            status: row['status'],
          };
       
          results.push(loanData);
        })
        .on("end", async () => {
          try {
            const createdLoanDetails = await LoanDetails.bulkCreate(results);
          // Now, create tasks using the createdLoanDetails
          for (const loanDetail of createdLoanDetails) {
            await Task.create({
              task_id: loanDetail.id,
              assignee: loanDetail.executive_id,
              status:1
            });
          }
            // Perform file unlink inside the callback when the read stream has finished processing.
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error deleting the file:", err);
              } else {
                console.log("File deleted successfully!");
              }
            });
          } catch (err) {
            console.error("Error inserting data into the database:", err);
          }
        })
        .on("error", (err) => {
          console.error("Error reading the CSV file:", err);
        });
    } else {
      return res.status(400).json({
        status: false,
        message: "Unsupported file format.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Data inserted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const LoanDetailList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const where = {

    }
    const loadData = await LoanDetails.findAll({
      include:[{
        attributes:['name'],
        model:User
      }],
      limit,
      offset: (page - 1) * limit,
    });

    return res.status(500).json({
      status: false,
      message: "Loan details list",
      data: loadData,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};
const LoanDetailView = async (req, res) => {
  try {
    const loadData = await LoanDetails.findOne({
      where: {
        id: req.params.id,
      },
    });

    return res.status(500).json({
      status: false,
      message: "Loan details",
      data: loadData,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const loanUpdate = async (req, res) => {
  try {
    const data = req.body;
    let update = await LoanDetails.update(
      {
        executive_id: data.executive_id,
        loan_account_number: data.loan_account_number,
        customer_name: data.customer_name,
        mobile_no: data.mobile_no,
        address: data.address,
        city: data.city,
        bank_branch: data.bank_branch,
        bom_dpd: data.bom_dpd,
        loan_amount: data.loan_amount,
        total_overdue_amount: data.total_overdue_amount,
        current_pos: data.current_pos,
        remaining_turnover_required: data.remaining_turnover_required,
        sma_tagging: data.sma_tagging,
        product_type: data.product_type,
        status: data.status,
      },
      {
        where: {
          id: req.params.id,
        },
      });

    if (update[0] > 0) {
      return res.json({
        status: true,
        message: "Update successfully",
      });
    } else {
      return res.json({
        status: false,
        message: "Something went wrong",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const assignTask = async (req, res) => {
  try{
    
  }catch(err)
  {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
}

module.exports = {
  loanUpload,
  LoanDetailList,
  LoanDetailView,
  loanUpdate,
};
