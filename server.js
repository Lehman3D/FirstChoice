//check if we are running in the prod or dev environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
 const fs = require('fs');
 const path = require('path');
 const multer = require('multer');


// Router files
const indexRouter = require('./routes/index')
const eventRouter = require('./routes/events')
const venueRouter = require('./routes/venues')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

//connect to db
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/events', eventRouter)
app.use('/venues', venueRouter)

app.listen(process.env.PORT  || 3000)
