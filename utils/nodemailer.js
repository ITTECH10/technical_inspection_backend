const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user) {
    this.to = user.email
    this.from = process.env.EMAIL_FROM
    this.user = user;
  }

  newTransport() {
    // Sendgrid
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(subject, text) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text
    };

    await this.newTransport().sendMail(mailOptions, (err, info) => {
      if (err) console.log(err)
      // console.log(info)
    })
  }

  async carAdded() {
    await this.send(`New car added`, `${this.user.email} added a new car.`)
  }

  async customerCreated(password) {
    await this.send('Profile created', `Your profile credentials: E-mail: ${this.user.email} Password: ${password}`)
  }

  async sendPasswordReset(resetUrl) {
    await this.send("Reset Password", `Hi ${this.user.firstName} here is your password reset URL ${resetUrl}. (Valid for only 10 minutes.)`)
  }
};
