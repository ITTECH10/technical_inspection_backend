const nodemailer = require('nodemailer')

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

    async loadTemplateAndSendEmail(template, recipient, subject, vehicle) {
        const formatedTemplate = template.replaceAll('{{recipient}}', `${recipient.firstName} ${recipient.lastName}`)
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`)

        recipient ? await this.sendToCustomer(recipient, subject, formatedTemplate)
            : await this.sendToAdmin(subject, formatedTemplate)
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
            text: text
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