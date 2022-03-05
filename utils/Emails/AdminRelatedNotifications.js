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

    async reportVehicleDamage(car, damageDescription) {
        const subject = "Fahrzeugschaden"
        const body = `Hallo, hier ist mein Schadensbericht zu meinem Fahrzeug
        kunde: ${car.vehicleOwner.firstName} ${car.vehicleOwner.lastName} 
        fahrzeug: ${car.mark} ${car.model}
        link: https://secarmanagement.vercel.app/cars/${car._id}
        Schadensbeschreibung: ${damageDescription}`

        await super.sendToAdmin(subject, body)
    }

    // async reportVehicleDamage (vehicle, damageDescription) {
    //     const subject = 'Fahrzeugschaden'
    //     const template = super.loadTemplate('ADMIN_RELATED', 'reportVehicleDamage')


    //     await super.sendToAdmin(subject, formatedTemplate)
    // }

    async userResetedPassword(customer) {
        const subject = 'Passwort zurückgesetzt'
        const body = `Kunde hat sein passwort zurückgesetzt
        Kunde: ${customer.firstName} ${customer.lastName}
        `
        if (customer.role === 'admin') return
        await super.sendToAdmin(subject, body)
    }
}

module.exports = AdminEmailNotifications