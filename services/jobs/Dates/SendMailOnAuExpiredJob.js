const Vehicle = require('./../../../models/VehicleModel')
const User = require('./../../../models/UserModel')
const EmailJob = require('../../jobs/EmailJob')
const DateGenerator = require('../../../utils/DateGenerator')

// IMPORTANT TO BE GLOBAL SCOPE!
const oneMonthFromNow = new DateGenerator().monthsFromNow(1).setHours(23, 59, 59, 999)
const twoMonthsFromNow = new DateGenerator().monthsFromNow(2).setHours(23, 59, 59, 999)
const currentDate = new Date().toISOString()

class SendMailOnAuExpiredJob extends EmailJob {
    constructor() {
        super()
        this.AuExpiringInOneMonthsVehicles = []
        this.AuExpiringInTwoMonthsVehicles = []
    }

    async auExpiringInOneMonth() {
        this.AuExpiringInOneMonthsVehicles = await Vehicle.find({ AU: { $gte: currentDate, $lte: oneMonthFromNow }, carIsSold: false })
        if (this.AuExpiringInOneMonthsVehicles.length === 0) return

        this.AuExpiringInOneMonthsVehicles.map(async foundVehicle => {
            try {
                const users = await User.find({ _id: foundVehicle.vehicleOwner._id })

                users.forEach(async (user) => {
                    if (user.AuExpiredEmailNotifier && !await user.compareAuEmailExpiredNotifier(`${user._id}`, user.AuExpiredEmailNotifier)) {
                        throw new Error('AU email hash comparasion did not match!')
                    }

                    if (!user.AuExpiredEmailNotifier) {
                        try {
                            const body = `AU für Ihr Fahrzeug ${foundVehicle.mark} ${foundVehicle.model} läuft in ein monat ab.`
                            const emailTo = foundVehicle.vehicleOwner

                            if (user.customerType === 'firmenkunde') {
                                await super.sendToContactPerson(user.corespondencePartnerEmail, "AU abgelaufen", body)
                            }

                            if (user.customerType === 'privat') {
                                await super.sendToCustomer(emailTo, "AU abgelaufen", body)
                            }

                            await user.createAuEmailExpiredNotifier(user._id)
                            await user.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            user.AuExpiredEmailNotifier = undefined
                            await user.save({ validateBeforeSave: false })
                        }
                    }
                })
            } catch (err) {
                console.log(err)
            }
        })
    }

    async auExpiringInTwoMonths() {
        this.AuExpiringInTwoMonthsVehicles = await Vehicle.find({ AU: { $gte: oneMonthFromNow, $lte: twoMonthsFromNow }, carIsSold: false })
        if (this.AuExpiringInTwoMonthsVehicles.length === 0) return

        this.AuExpiringInTwoMonthsVehicles.map(async foundVehicle => {
            try {
                const users = await User.find({ _id: foundVehicle.vehicleOwner._id })

                users.forEach(async (user) => {
                    if (user.AuExpiredEmailNotifier && !await user.compareAuEmailExpiredNotifier(`${user._id}`, user.AuExpiredEmailNotifier)) {
                        throw new Error('AU email hash comparasion did not match!')
                    }

                    if (!user.AuExpiredEmailNotifier) {
                        try {
                            const body = `AU für Ihr Fahrzeug ${foundVehicle.mark} ${foundVehicle.model} läuft in zwei monaten ab.`
                            const emailTo = foundVehicle.vehicleOwner

                            if (user.customerType === 'firmenkunde') {
                                await super.sendToContactPerson(user.corespondencePartnerEmail, "AU abgelaufen", body)
                            }

                            if (user.customerType === 'privat') {
                                await super.sendToCustomer(emailTo, "AU abgelaufen", body)
                            }

                            await user.createAuEmailExpiredNotifier(user._id)
                            await user.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            user.AuExpiredEmailNotifier = undefined
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

module.exports = SendMailOnAuExpiredJob
