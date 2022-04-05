const EmailNotifications = require('./EmailNotifications')

class UserEmailNotifications extends EmailNotifications {
    constructor() {
        super()
    }

    async vehicleDeleted(customer, vehicle) {
        const subject = "SE Carmanagement | Fahrzeug gelöscht"
        const template = super.loadTemplate('VEHICLE_RELATED', 'vehicleDeleted')

        const formatedTemplate = template
            .replaceAll('{{name}}', `${customer.firstName} ${customer.lastName}`)
            .replaceAll('{{gender}}', customer.gender === 'Mr' ? 'geehrter Herr' : 'geeherte Frau')
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`)

        await this.sendToCustomer(customer, subject, formatedTemplate)
    }

    // async customerCreated(customer, password) {
    //     const subject = "SE Carmanagement | Ihr Profil wurde erstellt"
    //     const template = super.loadTemplate('CUSTOMER_RELATED', 'customerCreated')

    //     const formatedTemplate = template.replaceAll('{{recipientEmail}}', customer.email)
    //         .replaceAll('{{recipientPassword}}', password)

    //     await this.sendToCustomer(customer, subject, formatedTemplate)
    // }

    async ntiServiceExpiresInNextMonth(customer, vehicle) {
        const subject = "SE Carmanagement | Vertrauen ist gut. Kontrolle auch!"
        const template = super.loadTemplate('VEHICLE_RELATED', 'oneMonthBeforeServiceExpiration')

        const formatedTemplate = template
            .replaceAll('{{name}}', `${customer.firstName} ${customer.lastName}`)
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`)
            .replaceAll('{{gender}}', customer.gender === 'Mr' ? 'geehrter Herr' : 'geeherte Frau')
            .replaceAll('{{registrationPlates}}', vehicle.registrationNumber)

        await this.sendToCustomer(customer, subject, formatedTemplate)
    }

    async tuvExpiresInUpcomingMonth(customer, vehicle) {
        const subject = "SE Carmanagement | TÜV läuft nächsten Monat aus!"
        const template = super.loadTemplate('VEHICLE_RELATED', 'oneMonthBeforeTuvExpiration')

        const formatedTemplate = template
            .replaceAll('{{name}}', `${customer.firstName} ${customer.lastName}`)
            .replaceAll('{{gender}}', customer.gender === 'Mr' ? 'geehrter Herr' : 'geeherte Frau')
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`)
            .replaceAll('{{registrationPlates}}', vehicle.registrationNumber)

        await this.sendToCustomer(customer, subject, formatedTemplate)
    }

    async tuvExpiresInUpcomingTwoMonths(customer, vehicle) {
        const subject = "SE Carmanagement | TÜV läuft in zwei Monaten ab!"
        const template = super.loadTemplate('VEHICLE_RELATED', 'twoMonthsBeforeTuvExpiration')

        const formatedTemplate = template
            .replaceAll('{{name}}', `${customer.firstName} ${customer.lastName}`)
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`)
            .replaceAll('{{gender}}', customer.gender === 'Mr' ? 'geehrter Herr' : 'geeherte Frau')
            .replaceAll('{{registrationPlates}}', vehicle.registrationNumber)

        await this.sendToCustomer(customer, subject, formatedTemplate)
    }

    async auExpiresInUpcomingMonth(customer, vehicle) {
        const subject = "SE Carmanagement | Abgasuntersuchung läuft nächsten Monat aus!"
        const template = super.loadTemplate('VEHICLE_RELATED', 'oneMonthBeforeAuExpiration')

        const formatedTemplate = template.replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`)
            .replaceAll('{{registrationPlates}}', vehicle.registrationNumber)

        await this.sendToCustomer(customer, subject, formatedTemplate)
    }

    async auExpiresInUpcomingTwoMonths(customer, vehicle) {
        const subject = "SE Carmanagement | Abgasuntersuchung läuft in zwei Monaten ab"
        const template = super.loadTemplate('VEHICLE_RELATED', 'twoMonthsBeforeAuExpiration')

        const formatedTemplate = template.replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`)
            .replaceAll('{{registrationPlates}}', vehicle.registrationNumber)

        await this.sendToCustomer(customer, subject, formatedTemplate)
    }

    async creditExpiresInThreeMonths(customer, vehicle) {
        const subject = "Ihre KFZ-Finanzierung läuft in drei Monaten aus!"
        const template = super.loadTemplate('VEHICLE_RELATED', 'threeMonthsBeforeCreditExpiration')

        const formatedTemplate = template
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`)
            .replaceAll('{{registrationPlates}}', vehicle.registrationNumber)
            .replaceAll('{{gender}}', customer.gender === 'Mr' ? 'geehrter Herr' : 'geeherte Frau')
            .replaceAll('{{name}}', `${customer.firstName} ${customer.lastName}`)

        await this.sendToCustomer(customer, subject, formatedTemplate)
    }

    async creditExpiresInSixMonths(customer, vehicle) {
        const subject = "SE Carmanagement | Ihre KFZ-Finanzierung läuft in sechs Monaten aus!"
        const template = super.loadTemplate('VEHICLE_RELATED', 'sixMonthsBeforeCreditExpiration')

        const formatedTemplate = template
            .replaceAll('{{name}}', `${customer.firstName} ${customer.lastName}`)
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`)
            .replaceAll('{{gender}}', customer.gender === 'Mr' ? 'geehrter Herr' : 'geeherte Frau')
            .replaceAll('{{registrationPlates}}', vehicle.registrationNumber)

        await this.sendToCustomer(customer, subject, formatedTemplate)
    }

    async leasingExpiresInThreeMonths(customer, vehicle) {
        const subject = "SE Carmanagement | Ihr KFZ-Leasing läuft in drei Monaten aus!"
        const template = super.loadTemplate('VEHICLE_RELATED', 'threeMonthsBeforeLeasingExpiration')

        const formatedTemplate = template
            .replaceAll('{{name}}', `${customer.firstName} ${customer.lastName}`)
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`)
            .replaceAll('{{gender}}', customer.gender === 'Mr' ? 'geehrter Herr' : 'geeherte Frau')
            .replaceAll('{{registrationPlates}}', vehicle.registrationNumber)

        await this.sendToCustomer(customer, subject, formatedTemplate)
    }

    async leasingExpiresInSixMonths(customer, vehicle) {
        const subject = "SE Carmanagement | Ihr KFZ-Leasing läuft in sechs Monaten aus!"
        const template = super.loadTemplate('VEHICLE_RELATED', 'sixMonthsBeforeLeasingExpiration')

        const formatedTemplate = template
            .replaceAll('{{name}}', `${customer.firstName} ${customer.lastName}`)
            .replaceAll('{{gender}}', customer.gender === 'Mr' ? 'geehrter Herr' : 'geeherte Frau')
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`)
            .replaceAll('{{registrationPlates}}', vehicle.registrationNumber)

        await this.sendToCustomer(customer, subject, formatedTemplate)
    }

    async customerDeleted(customer) {
        const subject = "SE Carmanagement | Ihr Profil wurde gelöscht."
        const template = super.loadTemplate('CUSTOMER_RELATED', 'customerDeleted')

        await super.sendToCustomer(customer, subject, template)
    }

    // async paymentOperations(customer, operation, paymentType, vehicle, changedValues) {
    //     const subject = `${paymentType} ${operation}`
    //     const template = super.loadTemplate('CUSTOMER_RELATED', 'paymentOperations')

    //     const formatedTemplate = template
    //         .replaceAll('{{name}}', `${customer.firstName} ${customer.lastName}`)
    //         .replaceAll('{{gender}}', customer.gender === 'Mr' ? 'geehrter Herr' : 'geeherte Frau')
    //         .replaceAll('{{paymentType}}', paymentType)
    //         .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model} ${vehicle.registrationNumber}`)
    //         .replaceAll('{{vehicleId}}', vehicle._id)
    //         .replaceAll('{{operation}}', operation)

    //     await super.sendToCustomer(customer, subject, formatedTemplate)
    // }
}

module.exports = UserEmailNotifications