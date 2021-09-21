exports.generateChangedValues = (o1, o2) => {
    const changedValues = Object.keys(req.body).reduce((a, k) => (JSON.stringify(o1[k]) !== JSON.stringify(o2[k]) && (a[k] = o2[k]), a), {})
    const formatedChangedValues = changedValues.replace("{", "").replace("}", "")

    console.log(formatedChangedValues)

    return formatedChangedValues
}