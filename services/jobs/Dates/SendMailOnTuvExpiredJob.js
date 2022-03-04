const Vehicle = require('./../../../models/VehicleModel')
const User = require('./../../../models/UserModel')
const EmailJob = require('../../jobs/EmailJob')
const UserRelatedNotifications = require('../../../utils/Emails/UserRelatedNotifications')
const DateGenerator = require('../../../utils/DateGenerator')

// IMPORTANT TO BE GLOBAL SCOPE!
const oneMonthFromNow = new DateGenerator().monthsFromNow(1).setHours(23, 59, 59, 999)
const twoMonthsFromNow = new DateGenerator().monthsFromNow(2).setHours(23, 59, 59, 999)
const currentDate = new Date().toLocaleString('de-DE')

// Send email to a customer if TUV,AU,GENERAL INSPECTION EXPIRES
class SendMailOnTuvExpiredJob extends UserRelatedNotifications {
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

                users.forEach(async (user) => {
                    if (!foundVehicle.TuvExpiresInNextMonthNotifier) {
                        try {
                            if (user.customerType === 'firmenkunde') {
                                await super.tuvExpiresInUpcomingMonth({ email: user.corespondencePartnerEmail }, foundVehicle)
                            }

                            if (user.customerType === 'privat') {
                                await super.tuvExpiresInUpcomingMonth(user, foundVehicle)
                            }

                            await foundVehicle.createTuvExpiresInNextMonthNotifier(user._id)
                            await foundVehicle.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            foundVehicle.TuvExpiresInNextMonthNotifier = undefined
                            await foundVehicle.save({ validateBeforeSave: false })
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

                users.forEach(async (user) => {
                    if (!foundVehicle.TuvExpiresInNextTwoMonthsNotifier) {
                        try {
                            if (user.customerType === 'firmenkunde') {
                                await super.tuvExpiresInUpcomingTwoMonths({ email: user.corespondencePartnerEmail }, foundVehicle)
                            }

                            if (user.customerType === 'privat') {
                                await super.tuvExpiresInUpcomingTwoMonths(user, foundVehicle)
                            }

                            await foundVehicle.createTuvExpiresInNextTwoMonthsNotifier(user._id)
                            await foundVehicle.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            foundVehicle.TuvExpiresInNextTwoMonthsNotifier = undefined
                            await foundVehicle.save({ validateBeforeSave: false })
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
