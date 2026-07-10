
  require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo").default || require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");


const User = require("./models/user.js");
const ExpressError = require("./util/ExpressErrors.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

// ✅ 1. Template engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ 2. Body parsing BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl : process.env.ATLASDB_URL,
  crypto : {
    secret : process.env.SECRET
  },
  touchAfter : 24 * 3600,
});

// ✅ 3. Session & Flash BEFORE passport and routes
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

// ✅ 4. Passport AFTER session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ 5. Flash locals middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ✅ 6. DB connection
main().then(() => console.log("success")).catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/users", userRouter);

// ✅ 8. 404 handler
app.all("*all", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// ✅ 9. Error handler 
app.use((err, req, res, next) => {
    let {errcode = 404, errmsg = "Something went wrong" } = err;
    console.log(err);
    res.status(errcode).send(errmsg);
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});