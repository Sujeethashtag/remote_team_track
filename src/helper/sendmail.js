const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS:true,
    auth: {
        user: 'info@easyrfq.com',
        pass: 'smjzbqknczafghbv'
    }
});


module.exports = {
    transporter
}
