const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
/*
    img: {
        data: Buffer,
        contentType: String
    },
*/
/*
    image_filename: {
        type:String,
        required: false
    },
    image_path:{
        type:String,
        required: false
    },
*/
/*
    location: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
*/
/*
    time_start: {
        type: String,
        required: false
    },
    time_end: {
        type: String,
        required: false
    },
    ticket_link: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    desc: {
        type: String,
        required: false
    }
    */

})

module.exports = mongoose.model('Event', eventSchema)