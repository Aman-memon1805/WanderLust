const User = require("../models/user");

module.exports.signupForm = (req,res)=>{
    return res.render("users/signup.ejs");
};

module.exports.signupUser = async (req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({
        email,
        username,
        });
        let regUser = await User.register(newUser,password);
        console.log(regUser);
        req.login(regUser,(err)=>{
            if(err) { return next(err) };
            req.flash("success","Welcome to WanderLust!");
            return res.redirect("/listings");
        });
    }catch(err){
        console.log(err.message);
        req.flash("error",err.message);
        return res.redirect("/signup");
    }
    
};

module.exports.loginForm = (req,res)=>{
    return res.render("users/login.ejs");
};

module.exports.loginUser = async (req,res)=>{
    let {username} = req.body;
    req.flash("success",`Welcome back to WanderLust ${username}!`);
    let redirectUrl = res.locals.redirectUrl ? res.locals.redirectUrl : "/listings";
    return res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are Logged out!");
        return res.redirect("/listings");
    })
};