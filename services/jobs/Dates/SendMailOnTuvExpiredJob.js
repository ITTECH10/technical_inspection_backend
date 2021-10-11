const Vehicle = require('./../../../models/VehicleModel')
const User = require('./../../../models/UserModel')
const EmailJob = require('../../jobs/EmailJob')
const DateGenerator = require('../../../utils/DateGenerator')

// IMPORTANT TO BE GLOBAL SCOPE!
const oneMonthFromNow = new DateGenerator().monthsFromNow(1).setHours(23, 59, 59, 999)
const twoMonthsFromNow = new DateGenerator().monthsFromNow(2).setHours(23, 59, 59, 999)
const currentDate = new Date().toISOString()

// Send email to a customer if TUV,AU,GENERAL INSPECTION EXPIRES
class SendMailOnTuvExpiredJob extends EmailJob {
    constructor() {
        super()
        this.TuvExpiringInOneMonthsVehicles = []
        this.TuvExpiringInTwoMonthsVehicles = []
    }

    async tuvExpiringInOneMonth() {
        this.TuvExpiringInOneMonthsVehicles = await Vehicle.find({ TUV: { $gte: currentDate, $lte: oneMonthFromNow }, carIsSold: false })
        if (this.TuvExpiringInOneMonthsVehicles.length === 0) return

        this.TuvExpiringInOneMonthsVehicles.map(async foundVehicle => {
            try {
                const users = await User.find({ _id: foundVehicle.vehicleOwner._id })

                // TOKEN HASHING AND SENDING MAILS ONLY TO USERS THAT DID NOT RECEIVE IT YET
                // VEHICLEOWNERID = 613b5f48baae5c1eb4118c57 + TUVDATE + CHASSIS NUMER = #
                users.forEach(async (user) => {
                    if (user.TuvExpiredEmailNotifier && !await user.compareTuvEmailExpiredNotifier(`${user._id}`, user.TuvExpiredEmailNotifier)) {
                        throw new Error('Tuv email hash comparasion did not match!')
                    }

                    if (!user.TuvExpiredEmailNotifier) {
                        try {
                            const body = `TÜV für Ihr Fahrzeug ${foundVehicle.mark} ${foundVehicle.model} läuft in ein monat ab.`
                            const emailTo = foundVehicle.vehicleOwner

                            if (user.customerType === 'firmenkunde') {
                                await super.sendToContactPerson(user.corespondencePartnerEmail, "TUV abgelaufen", body)
                            }

                            if (user.customerType === 'privat') {
                                await super.sendToCustomer(emailTo, "TUV abgelaufen", body)
                            }

                            await user.createTuvEmailExpiredNotifier(user._id)
                            await user.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            user.TuvExpiredEmailNotifier = undefined
                            await user.save({ validateBeforeSave: false })
                        }
                    }
                })
            } catch (err) {
                console.log(err)
            }
        })
    }

    async tuvExpiringInTwoMonths() {
        this.TuvExpiringInTwoMonthsVehicles = await Vehicle.find({ TUV: { $gte: oneMonthFromNow, $lte: twoMonthsFromNow }, carIsSold: false })
        if (this.TuvExpiringInTwoMonthsVehicles.length === 0) return

        this.TuvExpiringInTwoMonthsVehicles.map(async foundVehicle => {
            try {
                const users = await User.find({ _id: foundVehicle.vehicleOwner._id })

                // TOKEN HASHING AND SENDING MAILS ONLY TO USERS THAT DID NOT RECEIVE IT YET
                // VEHICLEOWNERID = 613b5f48baae5c1eb4118c57 + TUVDATE + CHASSIS NUMER = #
                users.forEach(async (user) => {
                    if (user.TuvExpiredEmailNotifier && !await user.compareTuvEmailExpiredNotifier(`${user._id}`, user.TuvExpiredEmailNotifier)) {
                        throw new Error('Tuv email hash comparasion did not match!')
                    }

                    if (!user.TuvExpiredEmailNotifier) {
                        try {
                            const body = `TÜV für Ihr Fahrzeug ${foundVehicle.mark} ${foundVehicle.model} läuft in zwei monaten ab.`
                            const emailTo = foundVehicle.vehicleOwner

                            if (user.customerType === 'firmenkunde') {
                                await super.sendToContactPerson(user.corespondencePartnerEmail, "TUV abgelaufen", body)
                            }

                            if (user.customerType === 'privat') {
                                await super.sendToCustomer(emailTo, "TUV abgelaufen", body)
                            }

                            await user.createTuvEmailExpiredNotifier(user._id)
                            await user.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            user.TuvExpiredEmailNotifier = undefined
                            await user.save({ validateBeforeSave: false })
                        }
                    }
                })
            } catch (err) {
                console.log(err)
            }
        })
    }
}

module.exports = SendMailOnTuvExpiredJob
