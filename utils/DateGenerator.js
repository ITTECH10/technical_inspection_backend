module.exports = class DateGenerator {
    constructor(...fields) {
        this.fields = fields
    }

    expiresInGivenMonths(months) {
        return new Date(...this.fields) > new Date() && new Date(...this.fields) < new Date(new Date().setMonth(new Date().getMonth() + +months))
    }

    expiresInGivenDays(days) {
        return new Date(...this.fields) > new Date() && new Date(...this.fields) < new Date(new Date().setDate(new Date().getDate() + +days))
    }
}