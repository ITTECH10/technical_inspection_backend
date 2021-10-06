const EmailNotifications = require('./EmailNotifications')

class CommonEmailNotifications extends EmailNotifications {
    constructor(role) {
        super()
        this.role = role
    }

    async carOperations(operation, car, customer, changedValues) {
        const subject = `Fahrzeug ${operation}`
        const body = `${this.role === 'admin' ? 'Admin' : 'Kunde'} hat ein Fahrzeug ${operation}
        ${this.role === 'user' ? `Kunde: ${customer.firstName} ${customer.lastName}` : ''}
        Fahrzeug: ${car.mark} ${car.model} ${car.registrationNumber}
        Link: http://localhost:3000/cars/${car._id}
        ${changedValues ? `Geänderte Werte: ${changedValues}` : ''}
        `

        this.role === 'admin' ? super.sendToCustomer(customer, subject, body) : super.sendToAdmin(subject, body)
    }

    async customerInformationsUpdated(customer, changedValues) {
        const subject = `Kunde aktuelisiert`
        const body = `${this.role === 'admin' ? 'Admin' : 'Kunde'} hat die profile informationen aktuelisiert
        ${this.role === 'user' ? `Kunde: ${customer.firstName} ${customer.lastName}` : ''}
        ${changedValues ? `Geänderte Werte: ${changedValues}` : ''}
        `

        this.role === 'admin' ? super.sendToCustomer(customer, subject, body) : super.sendToAdmin(subject, body)
    }

    async documentOperations(customer, operation, car) {
        const subject = `Dokument ${operation}`
        const body = `${this.role === 'admin' ? 'Admin' : 'Kunde'} hat das dokument ${operation}
        ${this.role === 'user' ? `Kunde: ${customer.firstName} ${customer.lastName}` : ''}
        Fahrzeug: ${car.mark} ${car.model} ${car.registrationNumber}
        Link: http://localhost:3000/cars/${car._id}
        `

        this.role === 'admin' ? super.sendToCustomer(customer, subject, body) : super.sendToAdmin(subject, body)
    }


    async sendPasswordResetToken(customer, url) {
        const subject = 'Passwort zurücksetzen token'
        const body = `Um Ihr Passwort zurückzusetzen, klicken Sie bitte auf den untenstehenden Link ${url}
        Warnung, Token ist nur 10 Minuten gültig!!!
        `

        customer.role === 'user' ? super.sendToCustomer(customer, subject, body) : super.sendToAdmin(subject, body)
    }
}

module.exports = CommonEmailNotifications