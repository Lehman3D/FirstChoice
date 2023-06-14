const express = require('express')
const router = express.Router()
const Venue = require('../models/venue')
const Event = require('../models/event')

// All Venues Route
router.get('/', async (req, res) => {
     // search options
     let searchOptions = {}
     if (req.query.name != null && req.query.name !== '') {
         searchOptions.name = new RegExp(req.query.name, 'i')
     }
     // actual get info, just remove searchOptions if we dont want search
     try {
         const venues = await Venue.find(searchOptions)
         res.render('venues/index', {
             venues: venues,
             searchOptions: req.query
         })
     } catch {
         res.redirect('/')
     }
})

// New Venue Route
router.get('/new', (req, res) => {
    res.render('venues/new', { venue: new Venue() })
})

// Create Venue Route
router.post('/', async (req, res) => {
    const venue = new Venue({
        name: req.body.name,
        address: req.body.address
    })
    try{
        const newVenue = await venue.save()
        // res.redirect('events/${newEvent.id}')
        res.redirect('venues')
    } catch (err) {
        res.render('venues/new', {
            venue: venue,
            errorMessage: 'Error creating venue:' + err
            
        })
    }

})

module.exports = router