const express = require('express');
const upload = require('../helper/multer')
const route = express.Router();
const auth = require('../auth/auth')

//controller 
const UserController = require('../controller/userController')
const loginController = require('../controller/loginController')
const addressController = require('../controller/addressController')
const loanController = require('../controller/loanController')
const taskController = require('../controller/taskController')
const surveyController = require('../controller/surveyController')

//user route
route.post('/add-user', auth.client, UserController.addUser)
route.get('/user-list', auth.client, UserController.userList)
route.get('/user-details/:id', auth.client, UserController.userDetails)
route.put('/user-update/:id', auth.client, UserController.userUpdate)
route.post('/bulk-user-add', upload.upload.single('file'), UserController.bulkUserAdd)

//login route
route.post('/login', loginController.userLogin)
route.post('/logout', loginController.logout)
route.post('/password-change', loginController.passwordUpdate)
route.post('/forgot-password', loginController.forgotPassword)

//address controller 
route.get('/country-list', addressController.countryList)
route.get('/state-list', addressController.stateList)

//* loan details
route.post('/upload-loan-details', upload.upload.single('file'),  auth.client, loanController.loanUpload)
route.get('/loan-details-list', auth.client, loanController.LoanDetailList)
route.get('/loan-details-view/:id', auth.client, loanController.LoanDetailView)
route.get('/loan-details-update/:id', auth.client, loanController.loanUpdate)

//User Task
route.get('/task-list', auth.client, taskController.listOfTask)
route.get('/task-view/:id', auth.client, taskController.taskView)

//Survey 
route.post('/add-survey', auth.client, surveyController.surveyAdd)
route.get('/reason-list', auth.client, surveyController.reasonList)
route.get('/survey-list', auth.client, surveyController.surveyList)
route.get('/survey-export', auth.client, surveyController.surveyExport)



module.exports = route