const express = require('express')
const router = express.Router()
const Venue = require('../models/venue')
const Event = require('../models/event')

// All Venues Route
router.get('/', async (req, res) => {
     let searchOptions = {}
     if (req.query.name != null && req.query.name !== '') {
         searchOptions.name = new RegExp(req.query.name, 'i')
     }
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
    try {
        const newVenue = await venue.save()
        res.redirect(`venues/${newVenue.id}`)
    } catch (err) {
        res.render('venues/new', {
            venue: venue,
            errorMessage: 'Error creating venue:' + err
        })
    }
})

// Show a Venue
router.get('/:id', async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id)
        const events = await Event.find({ venue: venue.id }).limit(6).exec()
        res.render('venues/show', {
            venue: venue,
            eventsByVenue: events
        })
    } catch {
        res.redirect('/')
    }
})

// Edit Venue Route
router.get('/:id/edit', async (req, res) => {
    try{
        const venue= await Venue.findById(req.params.id)
        res.render('venues/edit', { venue: venue })
    } catch {
        res.redirect('/venues')
    }
})

// Update Venue Route
router.put('/:id', async (req, res) => {
    let venue
    try{
        venue = await Venue.findById(req.params.id)
        venue.name = req.body.name
        venue.address = req.body.address
        await venue.save()
        res.redirect(`/venues/${venue.id}`)
    } catch (err) {
        if (venue == null) {
            res.redirect('/')
        } else {
            res.render('venues/edit', {
                venue: venue,
                errorMessage: 'Error updating venue:' + err
            })
        }
    }
})

// Delete Venue Route
router.delete('/:id', async (req, res) => {
    let venue
    try{
        venue = await Venue.findById(req.params.id)
        await venue.deleteOne({ _id: req.params.id })
        res.redirect('/venues')
    } catch  {
        if (venue == null) {
            res.redirect('/')
        } else {
            res.redirect(`/venues/${venue.id}`)
        }
    }
})


module.exports = router