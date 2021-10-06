const EmailNotifications = require('./EmailNotifications')

class UserEmailNotifications extends EmailNotifications {
    constructor() {
        super()
    }

    async vehicleDeleted(car, customer) {
        const subject = "Fahrzeug gelöscht"
        const body = `Admin hat ein Fahrzeug gelöscht
        Fahrzeug: ${car.mark} ${car.model} ${car.registrationNumber}
        Link: http://localhost:3000/cars/${car._id}
        `

        await super.sendToCustomer(customer, subject, body)
    }

    async customerCreated(customer, password, url) {
        const subject = "Kunde hinzugefügt"
        const body = `Admin hat ihres Profil erstellt
        Informationen: E-mail: ${customer.email} Password: ${password}
        Bitte besuchen Sie diese URL, um zu beginnen ${url}
        `
        await super.sendToCustomer(customer, subject, body)
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
        Link: http://localhost:3000/cars/${car._id}
        ${changedValues ? `Geänderte Werte: ${changedValues}` : ''}
        `

        await super.sendToCustomer(customer, subject, body)
    }
}

module.exports = UserEmailNotifications