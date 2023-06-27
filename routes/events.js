const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const Venue = require('../models/venue')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// All Events Route
router.get('/', async (req, res) => {
    let query = Event.find()
    if (req.query.name != null && req.query.name !== '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    if (req.query.venue != null && req.query.venue !== '') {
        query = query.regex('venue', new RegExp(req.query.venue, 'i'))
    }
    // actual get info, just remove searchOptions if we dont want search
    try {
        const venues = await Venue.find({})
        const events = await query.exec()
        res.render('events/index', {
            venues: venues,
            events: events,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
    
})

// New Event Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Event() )
})

// Create Event Route
router.post('/', async (req, res) => {
    const event = new Event({
        name: req.body.name,
        venue: req.body.venue,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        ticketLink: req.body.ticketLink,
        date: new Date(req.body.date),
        desc: req.body.desc
    })
    saveImage(event, req.body.eventImage)
    try{
        const newEvent = await event.save()
        res.redirect(`events/${newEvent.id}`)
    } catch (err) {
        renderNewPage(res, event, true, err)
    }
})

// Show a Event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('venue').exec()
        res.render('events/show', { event: event })
    } catch {
        res.redirect('/')
    }
})

// Edit Event Route
router.get('/:id/edit', async (req, res) => {
    try{
        const event= await Event.findById(req.params.id)
        renderEditPage(res, event)
    } catch {
        res.redirect('/event')
    }
})

// Update Event Route
router.put('/:id', async (req, res) => {
console.log('put')
    let event
    try{
        event = await Event.findById(req.params.id)
        event.name = req.body.name
        event.venue = req.body.venue
        event.startTime = req.body.startTime
        event.endTime = req.body.endTime
        event.ticketLink = req.body.ticketLink
        event.date = new Date(req.body.date)
        event.desc = req.body.desc
        if (req.body.eventImage != null && req.body.eventImage !== '') {
            saveImage(event, req.body.eventImage)
        }
        await event.save()
        res.redirect(`/events/${event.id}`)
    } catch (err) {
console.log(err)
        if (event != null) {
            renderEditPage(res, event, true, err)
        } else {
            redirect('/')
        }
    }
})

// Delete Venue Route
router.delete('/:id', async (req, res) => {
    let event
    try{
        event = await Event.findById(req.params.id)
        await event.deleteOne({ _id: req.params.id })
        res.redirect('/events')
    } catch  {
        if (event != null) {
            res.render('events/show', {
                event: event,
                errorMessage: 'Could not remove event'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, event, hasError = false, err) {
    renderFormPage(res, event, 'new', hasError, err)
}

async function renderEditPage(res, event, hasError = false, err) {
    renderFormPage(res, event, 'edit', hasError, err)
}

async function renderFormPage(res, event, form, hasError = false, err) {
    try {
        const venues = await Venue.find({})
        const params = {
            venues: venues,
            event: event
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Book' + err
              } else {
                params.errorMessage = 'Error Creating Book' + err
              }
        }
        res.render(`events/${form}`, params)
    } catch {
        res.redirect('/events')
    }
}

function saveImage( event, imageEncoded) {
    if(imageEncoded == null) return
    const image = JSON.parse(imageEncoded)
    if (image != null && imageMimeTypes.includes(image.type)) {
        event.eventImage = new Buffer.from(image.data, 'base64')
        event.eventImageType = image.type
    }
}

module.exports = router