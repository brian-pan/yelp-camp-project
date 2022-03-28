const Review = require('../models/review')
const Campground = require('../models/campground')

//post review
module.exports.postReview = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review created successfully!')
    res.redirect(`/campgrounds/${campground._id}`);
}

//delete review
module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!')
    res.redirect(`/campgrounds/${id}`)
}