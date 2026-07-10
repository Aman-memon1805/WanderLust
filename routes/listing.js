const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const reviews = require("../models/reviews.js");

const listingController = require("../controllers/listing.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/").get(wrapAsync(listingController.index))
.post(isLoggedIn, validateListing , upload.single('image'), wrapAsync(listingController.createNewListing));

// new listing
router.get("/new",isLoggedIn, wrapAsync(listingController.newListingform)); 
 

router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(listingController.editForm)); 

router.route("/:id")
.get( wrapAsync(listingController.showListing))  //  show each listing
.patch(isLoggedIn,isOwner, validateListing , upload.single('image'), wrapAsync(listingController.updateListing))  // update listing 
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));  // delete listing

module.exports = router;