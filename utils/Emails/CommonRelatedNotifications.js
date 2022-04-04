const EmailNotifications = require('./EmailNotifications')

class CommonEmailNotifications extends EmailNotifications {
    constructor(role) {
        super()
        this.role = role
    }

    async customerCreated(recipient, password) {
        const subject = "SE Carmanagement | Ihr Profil wurde erstellt"
        const template = super.loadTemplate('CUSTOMER_RELATED', 'customerCreated')

        const formatedTemplate = template.replaceAll('{{recipientEmail}}', recipient.email)
            .replaceAll('{{recipientPassword}}', password)

        if (recipient.loginCredentialsRecipient === 'kunde') {
            await this.sendToCustomer(recipient, subject, formatedTemplate)
        }

        if (recipient.loginCredentialsRecipient === 'admin') {
            await this.sendToAdmin(subject, formatedTemplate)
        }
    }

    async carOperations(operation, car, customer, changedValues) {
        const subject = `SE-Carmangement | Fahrzeug ${operation}`
        const body = `${this.role === 'admin' ? 'SE-Carmanagement' : 'Kunde'} hat ein Fahrzeug ${operation}
        ${this.role === 'user' ? `Kunde: ${customer.firstName} ${customer.lastName}` : ''}
        Fahrzeug: ${car.mark} ${car.model} ${car.registrationNumber}
        Link: https://app.se-carmanagement.de/cars/${car._id}
        ${changedValues ? `Geänderte Werte: ${changedValues}` : ''}
        `

        // this.role === 'admin' ? super.sendToCustomer(customer, subject, body) : super.sendToAdmin(subject, body)
        this.role === 'admin' && super.sendToAdmin(subject, body)
    }

    async customerInformationsUpdated(customer, changedValues) {
        const subject = `SE-Carmangement | Kundenstammdaten aktualisiert`
        const body = `${this.role === 'admin' ? 'SE-Carmanagement' : 'Kunde'} hat Stammdaten aktualisiert
        ${this.role === 'user' ? `Kunde: ${customer.firstName} ${customer.lastName}` : ''}
        ${changedValues ? `Geänderte Werte: ${changedValues}` : ''}
        `

        // this.role === 'admin' ? super.sendToCustomer(customer, subject, body) : super.sendToAdmin(subject, body)
        this.role === 'admin' && super.sendToAdmin(subject, body)
    }

    async documentOperations(customer, operation, car) {
        const subject = `SE-Carmangement | Dokument ${operation}`
        const body = `${this.role === 'admin' ? 'SE-Carmanagmenet' : 'Kunde'} hat das Dokument ${operation}
        ${this.role === 'user' ? `Kunde: ${customer.firstName} ${customer.lastName}` : ''}
        Fahrzeug: ${car.mark} ${car.model} ${car.registrationNumber}
        Link: https://app.se-carmanagement.de/cars/${car._id}
        `

        // this.role === 'admin' ? super.sendToCustomer(customer, subject, body) : super.sendToAdmin(subject, body)
        this.role === 'admin' && super.sendToAdmin(subject, body)
    }

    // async documentOperations(customer, operation, car) {
    //     const subject = `Dokument ${operation}`
    //     const template = super.loadTemplate('COMMON_RELATED', 'documentOperations')

    //     const formatedTemplate = `${this.role === 'admin' ? 'Admin' : 'Kunde'}` + template
    //     .replaceAll('{{}}')

    //     this.role === 'admin' ? super.sendToCustomer(customer, subject, formatedTemplate) : super.sendToAdmin(subject, formatedTemplate)
    // }

    async sendPasswordResetToken(customer, url) {
        const subject = 'SE-Carmangement | Passwort vergessen'
        const template = super.loadTemplate('COMMON_RELATED', 'sendPasswordResetToken')

        const formatedTemplate = template
            .replaceAll('{{url}}', url)

        customer.role === 'user' ? super.sendToCustomer(customer, subject, formatedTemplate) : super.sendToAdmin(subject, formatedTemplate)
    }
}

module.exports = CommonEmailNotifications