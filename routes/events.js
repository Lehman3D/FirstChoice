const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Event = require('../models/event')
const Venue = require('../models/venue')
const req = require('express/lib/request')
const uploadPath = path.join('public', Event.eventImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype) )
    }
})

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
router.post('/', upload.single('imgPath'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const event = new Event({
        name: req.body.name,
        venue: req.body.venue,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        ticketLink: req.body.ticketLink,
        date: new Date(req.body.date),
        desc: req.body.desc,
        img: fileName
    })
    try{
        const newEvent = await event.save()
        // res.redirect('events/${newEvent.id}')
        res.redirect('events')
    } catch (err) {
        if (event.img != null) {
            removeEventImg(event.img)
        }
        renderNewPage(res, event, true, err)
    }
})

function removeEventImg(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

async function renderNewPage(res, event, hasError = false, err) {
    try {
        const venues = await Venue.find({})
        const params = {
            venues: venues,
            event: event
        }
        if (hasError) params.errorMessage = 'Error Creating Event' + err
        res.render('events/new', params)
    } catch {
        res.redirect('/events')
    }
}

module.exports = router