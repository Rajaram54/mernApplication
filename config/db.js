const { Mongoose } = require("mongoose")

const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');


const connectDb = async () => {
    try {
        await mongoose.connect(db, {
             useNewUrlParser: true,
             useUnifiedTopology: true,
             useCreateIndex: true
        });
        console.log('Mongo connected...')
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

module.exports = connectDb;