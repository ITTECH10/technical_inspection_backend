const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const Vehicle = require('./../models/VehicleModel')

dotenv.config({
    path: `${__dirname}/../config.env`
})

const DB = process.env.DB.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log('Die Verbindung zur Datenbank wurde erfolgreich aufgebaut...'))
    .catch(err => console.log(err))


// READ JSON FILE
const vehicles = JSON.parse(fs.readFileSync(`${__dirname}../../data/vehicles.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Vehicle.create(vehicles, { validateBeforeSave: false });
        console.log('Data successfully imported!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Vehicle.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
