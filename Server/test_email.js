const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || process.env.SMTP_USER,
        pass: process.env.EMAIL_PASS || process.env.SMTP_PASS,
    },
});

console.log(`Testing connection for: ${process.env.EMAIL_USER || process.env.SMTP_USER}`);

transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Connection failed:');
        console.error(error);
        process.exit(1);
    } else {
        console.log('✅ Server is ready to take our messages');
        process.exit(0);
    }
});
