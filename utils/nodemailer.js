const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(logedInUser, customer, logedOfUser) {
    this.to = logedOfUser ? logedOfUser.email : logedInUser.role === 'admin' ? customer.email : process.env.EMAIL_TO_ADMIN
    this.from = process.env.EMAIL_FROM
    this.sender = logedInUser && logedInUser.role === 'admin' ? "Admin" : customer && customer.email
    this.customer = customer
    this.logedOfUser = logedOfUser
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

  async carOperations(operation, car, changedValues) {
    await this.send(`Fahrzeug ${operation}`, `${this.sender} ${operation} a car ${car.mark} ${car.model} Link: http://localhost:3000/cars/${car._id} ${changedValues ? `Changed values are: ${changedValues}` : ''}`)
  }

  async paymentOperations(car, paymentType, operation, changedValues) {
    await this.send(`${paymentType} ${operation}`, `Admin ${operation} a ${paymentType} payment for ${car.mark} ${car.model} ${changedValues ? `Changed values are: ${changedValues}` : ''}`)
  }

  async documentOperations(operation, car, changedValues) {
    await this.send(`Dokument ${operation}`, `${this.sender} ${operation} a document for ${car.mark} ${car.model} ${changedValues ? `Changed values are: ${changedValues}` : ''}`)
  }

  async customerCreated(password, url) {
    await this.send('Profile created', `Your profile credentials: E-mail: ${this.customer.email} Password: ${password}. Please visit this url to get started ${url}`)
  }

  async sendPasswordReset(resetUrl) {
    await this.send("Reset Password", `Hi ${this.logedOfUser.firstName} here is your password reset URL ${resetUrl}. (Valid for only 10 minutes.)`)
  }

  async userResetedPassword() {
    await this.send("Passwort zurückgesetzt", `${this.sender} reseted his/hers password.`)
  }

  async userUpdatedInformation(changedValues) {
    await this.send("Kunde aktualisiert", `${this.sender} updated profile information. Link: http://localhost:3000/cars ${changedValues ? `Changed values are: ${changedValues}` : ''}`)
  }

  async deleteUser() {
    await this.send("Kunde gelöscht", `Admin deleted your profile.`)
  }
};
