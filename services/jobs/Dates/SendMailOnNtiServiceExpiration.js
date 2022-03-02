const Vehicle = require('./../../../models/VehicleModel')
const User = require('./../../../models/UserModel')
const UserRelatedNotifications = require('../../../utils/Emails/UserRelatedNotifications')
const DateGenerator = require('../../../utils/DateGenerator')

// IMPORTANT TO BE GLOBAL SCOPE!
const oneMonthFromNow = new DateGenerator().monthsFromNow(1).setHours(23, 59, 59, 999)
const currentDate = new Date().toISOString()

// Send email to a customer if NTI Service expires in next month
class SendMailOnNtiServiceExpiration extends UserRelatedNotifications {
    constructor() {
        super()
        this.NtiServiceVehiclesWillExpireInOneMonth = []
    }

    async ntiServiceExpiresInOneMonth() {
        // 1 a) Find all vehicles where NTI service date expires in next month
        this.NtiServiceVehiclesWillExpireInOneMonth = await Vehicle.find({ nextTechnicalInspection: { $gte: currentDate, $lte: oneMonthFromNow }, carIsSold: false })

        // 1 b) if no vehicles are found cancel function execution
        if (this.NtiServiceVehiclesWillExpireInOneMonth.length === 0) return

        // 2) Loop over found vehicles
        this.NtiServiceVehiclesWillExpireInOneMonth.map(async foundVehicle => {
            try {
                // 2 a) Find users associated with looping vehicle
                const users = await User.find({ _id: foundVehicle.vehicleOwner._id })

                // 2 b) Loop over found users from step above
                users.forEach(async (user) => {
                    // 2 c) If we did not mark and notified customer that his vehicle NTI service 
                    // expires in one month from now continue with function execution
                    if (!foundVehicle.ntiServiceExpiresInOneMonthEmailNotifier) {
                        try {
                            if (user.customerType === 'firmenkunde') {
                                // **NOTE** super.sendToCustomer method takes an object as an parameter
                                await super.ntiServiceExpiresInNextMonth({ email: user.corespondencePartnerEmail }, foundVehicle)
                            }

                            if (user.customerType === 'privat') {
                                await super.ntiServiceExpiresInNextMonth(user, foundVehicle)
                            }

                            // 2 d) After successfully sending the email, we mark the vehicle as "customer notified about NTI expiring soon"
                            await foundVehicle.createNtiServiceExpiresInOneMonthEmailNotifier(user._id)
                            await foundVehicle.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            foundVehicle.ntiServiceExpiresInOneMonthEmailNotifier = undefined
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

module.exports = SendMailOnNtiServiceExpiration
