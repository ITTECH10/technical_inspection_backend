const EmailNotifications = require('./EmailNotifications')

class UserEmailNotifications extends EmailNotifications {
    constructor() {
        super()
    }

    async vehicleDeleted(customer, vehicle) {
        const subject = "Fahrzeug gelöscht"
        const template = super.loadTemplate(VEHICLE_RELATED, vehicleDeleted)

        const formatedTemplate = template.replaceAll('{{recipient}}', `${customer.firstName} ${customer.lastName}`)
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`)

        await this.sendToCustomer(customer, subject, formatedTemplate)
    }

    async customerCreated(customer, password) {
        const subject = "Profil Hinzugefügt 🎉"
        const template = super.loadTemplate('CUSTOMER_RELATED', 'customerCreated')

        const formatedTemplate = template.replaceAll('{{recipientEmail}}', customer.email)
            .replaceAll('{{recipientPassword}}', password)

        await this.sendToCustomer(customer, subject, formatedTemplate)
    }

    async ntiServiceExpiresInNextMonth(customer, vehicle) {
        const subject = "SE Carmanagement - Vertrauen ist gut. Kontrolle auch!"
        const template = super.loadTemplate('CUSTOMER_RELATED', 'oneMonthBeforeServiceExpiration')

        const formatedTemplate = template.replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`)
            .replaceAll('{{registrationPlates}}', vehicle.registrationNumber)

        await this.sendToCustomer(customer, subject, formatedTemplate)
    }


    async customerDeleted(customer) {
        const subject = "Kunde gelöscht"
        const body = `Admin hat ihres Profil gelöschen.`

        await super.sendToCustomer(customer, subject, body)
    }

    async paymentOperations(customer, operation, paymentType, car, changedValues) {
        const subject = `${paymentType} ${operation}`
        const body = `Admin hat ein ${paymentType} Zahlung ${operation}
        zum ${car.mark} ${car.model} ${car.registrationNumber}
        Link: https://secarmanagement.vercel.app/cars/${car._id}
        ${changedValues ? `Geänderte Werte: ${changedValues}` : ''}
        `

        await super.sendToCustomer(customer, subject, body)
    }
}

module.exports = UserEmailNotifications