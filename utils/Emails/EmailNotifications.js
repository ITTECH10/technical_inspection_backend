const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

class EmailNotifications {
    newTransport() {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    loadTemplate(folder, fileName) {
        const template = fs.readFileSync(path.join(__dirname, `../../templates/${folder}/${fileName}.html`), 'utf8', function (err, data) {
            if (err) {
                console.log(err)
                return
            }

            if (data) {
                return data
            }
        })

        return template
    }

    async sendToCustomer(customer, subject, text) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: customer.email,
            subject: subject,
            text: text,
            html: text
        }

        await this.newTransport().sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            }
            // console.log(info)
        })
    }

    async sendToAdmin(subject, text) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO_ADMIN,
            subject: subject,
            html: text
        }

        await this.newTransport().sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            }
            // console.log(info)
        })
    }
}

module.exports = EmailNotifications
