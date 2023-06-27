const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    eventImage: {
        type: Buffer,
        required: true
    },
    eventImageType: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    ticketLink: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    desc: {
        type: String,
        required: false
    },
    venue: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Venue'
    }
})

eventSchema.virtual('imgPath').get(function(){
    if (this.eventImage != null && this.eventImageType != null) {
        return `data:${this.eventImageType};charset=utf-8;base64,${this.eventImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Event', eventSchema)