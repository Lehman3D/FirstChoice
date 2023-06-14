const express = require('express')
const router = express.Router()
const Event = require('../models/event')

// All Events Route
router.get('/', async (req, res) => {
    // search options
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    // actual get info, just remove searchOptions if we dont want search
    try {
        const events = await Event.find(searchOptions)
        res.render('events/index', {
            events: events,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
    
})

// New Event Route
router.get('/new', (req, res) => {
    res.render('events/new', { event: new Event() })
})

// Create Event Route
router.post('/', async (req, res) => {
    const event = new Event({
        name: req.body.name
        // time_start: req.body.time_start,
        // time_end: req.body.time_end,
        // ticket_link: req.body.ticket_link,
        // date: req.body.date,
        // desc: req.body.desc
        //img: req.body.img
    })
    try{
        const newEvent = await event.save()
        // res.redirect('events/${newEvent.id}')
        res.redirect('events')
    } catch (err) {
        res.render('events/new', {
            event: event,
            errorMessage: 'Error creating event:' + err
            
        })
    }

    
    // const event = {
    //     name: req.body.name,
    //     time_start: req.body.time_start,
    //     time_end: req.body.time_end,
    //     ticket_link: req.body.ticket_link,
    //     date: req.body.date,
    //     desc: req.body.desc
    // }
    // Event.create(event).then((err, item) => {
    //     if (err) {
    //         console.log(err)
    //     }
    //     else {
    //         res.redirect('events')
    //     }
    // })
})

module.exports = router