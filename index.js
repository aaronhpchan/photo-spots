const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { spotSchema } = require('./schemas.js');
const wrapAsync = require('./utilities/wrapAsync');
const ExpressError = require('./utilities/ExpressError');
const Spot = require('./models/spot');

mongoose.connect('mongodb://localhost:27017/ig-spots');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const validateSpot = (req, res, next) => {   
    const { error } = spotSchema.validate(req.body);
    if(error) {
        const errorMsg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(errorMsg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/spots', wrapAsync(async (req, res) => {
    const spots = await Spot.find({});
    res.render('spots/index', { spots });
}));

app.get('/spots/new', (req, res) => {
    res.render('spots/new');
});
app.post('/spots', validateSpot, wrapAsync(async (req, res, next) => {
    const spot = new Spot(req.body.spot);
    await spot.save();
    res.redirect(`/spots/${spot._id}`);   
}));

app.get('/spots/:id', wrapAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('spots/details', { spot });
}));

app.get('/spots/:id/edit', wrapAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('spots/edit', { spot });
}));
app.put('/spots/:id', validateSpot, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
    res.redirect(`/spots/${spot._id}`);
}));

app.delete('/spots/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id);
    res.redirect('/spots');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('listening on port 3000');
});