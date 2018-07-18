const express      = require('express');
const userRouter   = express.Router();
const User         = require('../models/user');
const bcrypt       = require('bcryptjs');
const passport     = require('passport');



userRouter.get('/signup', (req, res, next)=>{
  res.render('userViews/signupPage');
})



userRouter.post('/signup', (req,res,next)=>{
  const thePassword = req.body.thePassword;
  const theUsername = req.body.theUsername;
  const theEmail = req.body.theEmail;
  const theType = req.body.theType;
  
  if (thePassword === "" || theUsername === "" || theEmail === '' ||  theType === ''){
    res.render('userViews/signupPage', {errorMessage: 'Please fill in the required info'})
    return;
  }
  
  User.findOne({'username': theUsername})
  .then((responseFromDB)=>{
    if (responseFromDB !== null){
      res.render('userViews/signupPage', {errorMessage: 'username taken'})
      return;
    }
    
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(thePassword, salt);
    
    User.create({username: theUsername, password: hashedPassword, email: theEmail, artist: theType})
    .then((response)=>{
      res.redirect('/login')
    })
    .catch((err)=>{
      next(err)
    })
  })
  })

userRouter.get('/login', (req, res, next)=>{
  res.render('userViews/loginPage', { message: req.flash("error") });
});

userRouter.post("/login", passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  }));




userRouter.get("/logout", (req, res, next) => {
      req.logout();
      res.redirect("/login");
  });






module.exports = userRouter;