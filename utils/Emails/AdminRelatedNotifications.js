const EmailNotifications = require('./EmailNotifications')

class AdminEmailNotifications extends EmailNotifications {
    constructor() {
        super()
    }

    async sellVehicleToAdmin(vehicle) {
        const subject = 'Fahrzeugverkauf'
        const template = super.loadTemplate('ADMIN_RELATED', 'sellVehicleToAdmin')

        const formatedTemplate = template.replaceAll('{{customer}}', `${vehicle.vehicleOwner.firstName} ${vehicle.vehicleOwner.lastName}`)
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`).replaceAll('{{vehicleId}}', vehicle._id)

        await super.sendToAdmin(subject, formatedTemplate)
    }

    async abortVehicleSellingToAdmin(vehicle) {
        const subject = "SE-Carmanagement | Kunde kann möchte sein Fahrzeug doch nicht verkaufen."
        const template = super.loadTemplate('ADMIN_RELATED', 'abortVehicleSellingToAdmin')

        const formatedTemplate = template.replaceAll('{{customer}}', `${vehicle.vehicleOwner.firstName} ${vehicle.vehicleOwner.lastName}`)
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`).replaceAll('{{vehicleId}}', vehicle._id)

        await super.sendToAdmin(subject, formatedTemplate)
    }

    async reportVehicleDamage(vehicle, damageDescription) {
        const subject = 'SE-Carmanagement | Fahrzeugschaden'
        const template = super.loadTemplate('ADMIN_RELATED', 'reportVehicleDamage')

        const formatedTemplate = template
            .replaceAll('{{customer}}', `${vehicle.vehicleOwner.firstName} ${vehicle.vehicleOwner.lastName}`)
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`).replaceAll('{{vehicleId}}', vehicle._id)
            .replaceAll('{{damageDescription}}', damageDescription)

        await super.sendToAdmin(subject, formatedTemplate)
    }

    async userResetedPassword(customer) {
        if (customer.role === 'admin') return
        const subject = 'Passwort zurückgesetzt'
        const template = super.loadTemplate('ADMIN_RELATED', 'userResetedPassword')

        const formatedTemplate = template
            .replaceAll('{{customer}}', `${customer.firstName} ${customer.lastName}`)

        await super.sendToAdmin(subject, formatedTemplate)
    }

    async paymentOperations(customer, operation, paymentType, vehicle, changedValues) {
        const subject = `${paymentType} ${operation}`
        const template = super.loadTemplate('ADMIN_RELATED', 'paymentOperations')

        const formatedTemplate = template
            .replaceAll('{{name}}', `${customer.firstName} ${customer.lastName}`)
            .replaceAll('{{paymentType}}', paymentType)
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model} ${vehicle.registrationNumber}`)
            .replaceAll('{{vehicleId}}', vehicle._id)
            .replaceAll('{{operation}}', operation)

        await super.sendToAdmin(subject, formatedTemplate)
    }
}

module.exports = AdminEmailNotifications