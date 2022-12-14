const { courseSchema , reviewSchema } = require("./schemas")
const ExpressError = require("./utils/expressError")
const Course = require("./models/course")
const Review = require("./models/review")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl // reroute to the page the user was trying to get to
        req.flash("error", "You must be signed in to complete this action!")
        return res.redirect("/login")
    }
    next()
}

module.exports.validateCourse = (req, res, next) => {
    const { error } = courseSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const course = await Course.findById(id)
    if(!course.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!")
        return res.redirect(`/courses/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!")
        return res.redirect(`/courses/${id}`)
    }
    next()
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}