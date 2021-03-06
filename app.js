//if in development mode, require dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

//libraries
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

//Models/Classes
const User = require('./models/user');

//routers
const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/review')
const userRoutes = require('./routes/users')

//view engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//utilities
const ExpressError = require('./Utilities/ExpressError');

//use packages
app.use(express.urlencoded({extended: true})) //parse req.body
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());//flash middleware (needed before route handlers!)

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//how to store it and remove it from session:
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user;
    // console.log('currentUser: ', res.locals.currentUser);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser', async(req, res) => {
//     const user = new User({email: 'brian@gmail.com', username: 'BRrrrr'});
//     const newUser = await User.register(user, 'brianpan')
//     res.send(newUser);
// })

//route handlers
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)



app.get('/', (req, res) => {
    res.render('home')
})
//error handler middleware
app.all('*', (req, res, next) => { //for all routes
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong.'
    res.status(statusCode).render('error', {err});
})
//app listen port set up
app.listen(3000, () => {
    console.log('Serving on port 3000');
})