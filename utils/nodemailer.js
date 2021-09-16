const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, isAdmin = false) {
    this.to = isAdmin ? user.email : process.env.EMAIL_TO_ADMIN
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
    await this.send(`New car added`, `${this.user.email} added a new vehicle.`)
  }

  async carDeleted(car) {
    await this.send("Fahrzeug gelöscht", `Admin deleted ${car.mark} ${car.model}`)
  }

  async carInformationUpdated(car) {
    await this.send("Fahrzeug aktualisiert", `${this.user.email} updated the information for ${car.mark} ${car.model}`)
  }

  async customerCreated(password, url) {
    await this.send('Profile created', `Your profile credentials: E-mail: ${this.user.email} Password: ${password}. Please visit this url to get started ${url}`)
  }

  async sendPasswordReset(resetUrl) {
    await this.send("Reset Password", `Hi ${this.user.firstName} here is your password reset URL ${resetUrl}. (Valid for only 10 minutes.)`)
  }

  async carDocumentAdded(car) {
    await this.send("Dokument hinzugefügt", `${this.user.email} added a new document for ${car.mark} ${car.model}`)
  }

  async carDocumentDeleted(car) {
    await this.send("Fahrzeug gelöscht", `${this.user.email} deleted a document for ${car.mark} ${car.model} `)
  }

  async paymentOperations(car, paymentType, operation) {
    await this.send("Barzahlung hinzugefügt", `Admin ${operation} a ${paymentType} payment for ${car.mark} ${car.model}`)
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
