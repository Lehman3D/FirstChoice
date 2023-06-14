const mongoose = require('mongoose')
const Event = require('./event')

const venueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Venue', venueSchema)