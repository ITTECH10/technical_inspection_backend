const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, notifyAdmin = true, isAdmin = false) {
    this.to = !isAdmin && notifyAdmin ? process.env.EMAIL_TO_ADMIN : user.email
    this.from = process.env.EMAIL_FROM
    this.user = user;
    this.isAdmin = isAdmin
    this.notifyAdmin = notifyAdmin
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
    if (!this.notifyAdmin) return
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

  async carOperations(operation, car) {
    await this.send(`Fahrzeug ${operation}`, `${this.isAdmin ? "Admin" : this.user.email} ${operation} a car ${car.mark} ${car.model}`)
  }

  async paymentOperations(car, paymentType, operation) {
    await this.send("Barzahlung hinzugefügt", `Admin ${operation} a ${paymentType} payment for ${car.mark} ${car.model}`)
  }

  async documentOperations(operation, car) {
    await this.send(`Dokument ${operation}`, `${this.isAdmin ? "Admin" : this.user.email} ${operation} a document for ${car.mark} ${car.model}`)
  }

  async customerCreated(password, url) {
    await this.send('Profile created', `Your profile credentials: E-mail: ${this.user.email} Password: ${password}. Please visit this url to get started ${url}`)
  }

  async sendPasswordReset(resetUrl) {
    await this.send("Reset Password", `Hi ${this.user.firstName} here is your password reset URL ${resetUrl}. (Valid for only 10 minutes.)`)
  }

  async userUpdatedInformation() {
    await this.send("Kunde aktualisiert", `${this.user.email} updated his profile information.`)
  }

  async deleteUser() {
    await this.send("Kunde gelöscht", `Admin deleted your profile.`)
  }

  async userResetedPassword() {
    await this.send("Kunde hat sein Passwort zurückgesetzt", `${this.user.email} changed his/hers password.`)
  }
};
