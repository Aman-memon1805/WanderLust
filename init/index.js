const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const initData = require("./listings.js");

const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });


main().then(res=>console.log("sucess")).catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}

const initDb = async ()=>{
    await Listing.deleteMany({});
    
    for (let listing of initData.data) {

      const resp = await geocodingClient.forwardGeocode({
        query: `${listing.location}, ${listing.country}`,
        limit: 1
      }).send();

      listing.geometry = resp.body.features[0].geometry;
    }

    initData.data = initData.data.map((obj)=> ({...obj,owner : '6a450141a1c79ccca88ac535'}));
    await Listing.insertMany(initData.data);
    console.log("Added all listings");
}

initDb();