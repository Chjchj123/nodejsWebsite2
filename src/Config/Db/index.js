const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.DB);
        console.log('Connect Successfull to Database');
    } catch (error) {
        console.log('Error To Connect To Database')
    }
}

module.exports = { connect };