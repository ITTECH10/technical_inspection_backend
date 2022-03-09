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
        const subject = "Meinungsänderung"
        const template = super.loadTemplate('ADMIN_RELATED', 'abortVehicleSellingToAdmin')

        const formatedTemplate = template.replaceAll('{{customer}}', `${vehicle.vehicleOwner.firstName} ${vehicle.vehicleOwner.lastName}`)
            .replaceAll('{{vehicle}}', `${vehicle.mark} ${vehicle.model}`).replaceAll('{{vehicleId}}', vehicle._id)

        await super.sendToAdmin(subject, formatedTemplate)
    }

    async reportVehicleDamage(vehicle, damageDescription) {
        const subject = 'Fahrzeugschaden'
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
}

module.exports = AdminEmailNotifications