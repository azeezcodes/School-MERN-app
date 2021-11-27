const nodemailer = require('nodemailer');

const sendEmail = async (email, link) => {
    try {
        const message = {
            from: process.env.USER,
            to: email,
            subject: 'Engage - Reset Password',
            html: `
              <p>Hey! </p>
              <p>To reset your password please follow this link: <a target="_" href=${link}>Reset Password Link</a></p>
              <p>This link will expire after one hour.</p>
              <p>Cheers,</p>
              <p>Engage Team</p>
            `
          }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: true,
            auth: {
                user: process.env.USER,
                pass:process.env.PASS
            },
        });

        await transporter.sendMail(message);
    } catch (error) {
        console.log(error, "email not sent");
    }
}

module.exports = sendEmail;