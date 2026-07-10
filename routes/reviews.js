const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../util/wrapAsync.js");
const Review = require("../models/reviews.js");    // Review model
const Listing = require("../models/listing.js");  // Listing model
const {validateReview} = require("../middleware.js");
const {isLoggedIn,isAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// post reviews
router.post("/",isLoggedIn, validateReview ,wrapAsync(reviewController.postReview));

// delete reviews 
router.delete("/:reviewId/delete",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;
