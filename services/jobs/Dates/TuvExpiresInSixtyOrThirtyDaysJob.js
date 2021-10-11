const Vehicle = require('./../../../models/VehicleModel')
const EmailJob = require('./../../jobs/EmailJob')
const DateGenerator = require('./../../../utils/DateGenerator')

const threeMonthsFromNow = new DateGenerator().monthsFromNow(3).setHours(23, 59, 59, 999)
const sixMonthsFromNow = new DateGenerator().monthsFromNow(6).setHours(23, 59, 59, 999)
const currentDate = new Date().toISOString()

// Send email to a customer if TUV,AU,GENERAL INSPECTION EXPIRES
class TuvExpiresInSixtyOrThirtyDaysJob extends EmailJob {
    constructor() {
        super()
        this.TUVexpiringInThreeMonths = []
        this.TUVexpiringInSixMonths = []
    }

    async tuvExpiresInThreeMonths() {
        this.TUVexpiringInThreeMonths = await Vehicle.find({ TUV: { $gte: currentDate, $lte: threeMonthsFromNow }, carIsSold: false })
        console.log(this.TUVexpiringInThreeMonths)

        this.TUVexpiringInThreeMonths.map(async foundVehicle => {
            const preventThreeMonthsExecution = new DateGenerator(foundVehicle.TUV).expiresInGivenMonths(3)
            console.log(preventThreeMonthsExecution)

            try {
                const body = `TÜV für Ihr Fahrzeug ${foundVehicle.mark} ${foundVehicle.model} läuft in den nächsten zwei Monaten ab.`
                const emailTo = foundVehicle.vehicleOwner
                // super.sendToCustomer(emailTo, "TÜV lauft in zwei monaten ab", body)
            } catch (err) {
                console.log(err)
            }
        })
    }

    async tuvExpiresInSixMonths() {
        this.TUVexpiringInSixMonths = await Vehicle.find({ TUV: { $gte: currentDate, $lte: sixMonthsFromNow }, carIsSold: false })
        this.TUVexpiringInSixMonths.map(async foundVehicle => {
            try {
                const body = `TÜV für Ihr Fahrzeug ${foundVehicle.mark} ${foundVehicle.model} läuft in den nächsten zwei Monaten ab.`
                const emailTo = foundVehicle.vehicleOwner
                // super.sendToCustomer(emailTo, "TÜV lauft in zwei monaten ab", body)
            } catch (err) {
                console.log(err)
            }
        })
    }
}

module.exports = TuvExpiresInSixtyOrThirtyDaysJob
