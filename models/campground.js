const mongoose = require('mongoose');
const Schema = mongoose.Schema; //shorten codes slightly

const CampgroundSchema = new Schema({
    title: String,
    type: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);