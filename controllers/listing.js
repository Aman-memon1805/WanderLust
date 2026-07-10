const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res, next) => { 
  let {category,search} = req.query;
  let filter = {};
  if (category) filter.category = category;
  if (search) {
      filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { country: { $regex: search, $options: "i" } },
      ];
  }

  let allListings = await Listing.find(filter);
  res.render("listings/index.ejs", { allListings , currCategory : category , currSearch: search}); 
};

module.exports.newListingform = async (req, res) => { 
  res.render("listings/new.ejs"); 
};

module.exports.createNewListing = async (req, res, next) => { 
  
  let { title, description, price, location, country } = req.body; 
  let url = req.file.path;
  let filename = req.file.filename;

  let resp = await geocodingClient.forwardGeocode({
    query: `${location} + ${country}`,
    limit: 1
  }).send();

  let newListing = new Listing({ 
    title: title, 
    image: { filename : filename , url: url}, 
    description: description, 
    location: location, 
    price: price, 
    country: country, 
  });
  newListing.owner = req.user._id;
  newListing.geometry = resp.body.features[0].geometry;
  
  await newListing.save();
  req.flash("success","Listing added successfully!");
  console.log("newListing:", newListing); 
  res.redirect("/listings"); 
};

module.exports.editForm = async (req, res) => { 
  let { id } = req.params; 
  let listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you are looking for does not exist!");
    return res.redirect("/listings");
  } 
  res.render("listings/edit.ejs", { listing }); 
};

module.exports.showListing = async (req, res, next) => { 
  let { id } = req.params; 
  let listing = await Listing.findById(id).populate({path :"reviews",populate : {path : "author"} }).populate("owner"); 
  if(!listing){
    req.flash("error","Listing you are looking for does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing }); 
};

module.exports.updateListing = async (req, res) => { 
  let { id } = req.params; 
  let { title, description, price, location, country } = req.body; 

  let resp = await geocodingClient.forwardGeocode({
    query: `${location} + ${country}`,
    limit: 1
  }).send();

  let listing = await Listing.findByIdAndUpdate(id, { 
    title: title, 
    description: description, 
    location: location, 
    price: price, 
    country: country, 
  }, { new: true }); 

  listing.geometry = resp.body.features[0].geometry;

  if(req.file){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {filename:filename , url:url};
    await listing.save();
  }

  await listing.save();

  req.flash("success","Listing updated successfully!");
  res.redirect(`/listings/${id}`); 
};

module.exports.deleteListing = async (req, res) => { 
  let { id } = req.params;
  // let listing = await Listing.findById(id);
  // await Review.deleteMany({_id : {$in : listing.reviews}}); 
  await Listing.findByIdAndDelete(id); 
  req.flash("success","Listing deleted successfully!");
  res.redirect("/listings"); 
};

