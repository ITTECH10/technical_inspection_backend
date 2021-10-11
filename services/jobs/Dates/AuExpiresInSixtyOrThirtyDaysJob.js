const Vehicle = require('./../../../models/VehicleModel')
const EmailJob = require('./../EmailJob')
const DateGenerator = require('./../../../utils/DateGenerator')

const twoMonthsFromNow = new DateGenerator().monthsFromNow(2)
const currentDate = new Date().toISOString()

// Send email to a customer if TUV,AU,GENERAL INSPECTION EXPIRES
class AuExpiresInSixtyOrThirtyDaysJob extends EmailJob {
    constructor() {
        super()
        this.AUexpiringInTwoMonths = []
    }

    async doJob() {
        this.AUexpiringInTwoMonths = await Vehicle.find({ AU: { $gte: currentDate, $lte: twoMonthsFromNow }, carIsSold: false })
        this.AUexpiringInTwoMonths.map(async foundVehicle => {
            try {
                const body = `AU für Ihr Fahrzeug ${foundVehicle.mark} ${foundVehicle.model} läuft in den nächsten zwei Monaten ab.`
                const emailTo = foundVehicle.vehicleOwner
                super.sendToCustomer(emailTo, "AU lauft in zwei monaten ab", body)
            } catch (err) {
                console.log(err)
            }
        })
    }
}

module.exports = AuExpiresInSixtyOrThirtyDaysJob
