const EmailNotifications = require('./EmailNotifications')

class AdminEmailNotifications extends EmailNotifications {
    constructor() {
        super()
    }

    async sellVehicleToAdmin(car) {
        const subject = "Fahrzeugverkauf"
        const body = `Hallo, ich möchte dieses Auto verkaufen bitte schauen Sie es sich an 
        kunde: ${car.vehicleOwner.firstName} ${car.vehicleOwner.lastName} 
        fahrzeug: ${car.mark} ${car.model}
        link: http://localhost:3000/cars/${car._id}`

        await super.sendToAdmin(subject, body)
    }

    async abortVehicleSellingToAdmin(car) {
        const subject = "Meinungsänderung"
        const body = `Hallo, ich möchte NICHT dieses Auto verkaufen bitte entschuldige Sie mich
        kunde: ${car.vehicleOwner.firstName} ${car.vehicleOwner.lastName} 
        fahrzeug: ${car.mark} ${car.model}
        link: http://localhost:3000/cars/${car._id}`

        await super.sendToAdmin(subject, body)
    }

    async reportVehicleDamage(car, damageDescription) {
        const subject = "Fahrzeugschaden"
        const body = `Hallo, hier ist mein Schadensbericht zu meinem Fahrzeug
        kunde: ${car.vehicleOwner.firstName} ${car.vehicleOwner.lastName} 
        fahrzeug: ${car.mark} ${car.model}
        link: http://localhost:3000/cars/${car._id}
        Schadensbeschreibung: ${damageDescription}`

        await super.sendToAdmin(subject, body)
    }

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