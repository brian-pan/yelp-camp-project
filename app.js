const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const express = require('express');
const app = express();
const path = require('path');

const Campground = require('./models/campground')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/makecampground', async (req, res) => {
    const camp = new Campground({title: 'My backyard', description: 'Cheap Camping'})
    await camp.save();
    res.send(camp)
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})