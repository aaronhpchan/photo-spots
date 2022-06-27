if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/users');
const spotRoutes = require('./routes/spots');
const commentRoutes = require('./routes/comments');

const MongoDBStore = require('connect-mongo'); 

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/ig-spots';

mongoose.connect(dbUrl);

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
app.use(mongoSanitize()); //express-mongo-sanitize removes keys that contain prohibited characters e.g. $

const secret = process.env.SECRET || 'secret-backup';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, //time period in seconds
    secret
});
store.on('error', e => console.log('session store error', e))

const sessionConfig = {
    store,
    name: 'session', //change default session name
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //cookies are only accessible through http
        //secure: true, //cookies can only be configured over https
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //time period in milliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //for persistent login sessions
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user; //passport deserialises info from the session and fill in req.user with that data
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
app.use('/spots', spotRoutes);
app.use('/spots/:id', commentRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});