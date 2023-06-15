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


// NEED TO EDIT THIS TO WORK PROPERLY (video 5, around 20 min mark)
venueSchema.pre('deleteOne', { document: false, query: true}, async function(next) {
    try {
    console.log('init to win it')
    console.log(this.getFilter())
        const query = this.getFilter();
        const hasEvent = await Event.exists({ venue: query._id });
  
        if (hasEvent) {
            next(new Error("This venue still has events."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
})


module.exports = mongoose.model('Venue', venueSchema)