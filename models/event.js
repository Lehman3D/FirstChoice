const mongoose = require('mongoose')
const path = require('path')
const eventImageBasePath = 'uploads/eventImg'

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img: {
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
    if (this.img != null) {
        return path.join('/', eventImageBasePath, this.img)
    }
})

module.exports = mongoose.model('Event', eventSchema)
module.exports.eventImageBasePath = eventImageBasePath