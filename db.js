require('dotenv').config();

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todos', { useNewUrlParser: true } )
    .then((data) => {
        console.log('MongoDb is connected succesfully')
    })
    .catch((err) => {
        console.log('Unable to connect', err)
    })

module.exports = { mongoose };


