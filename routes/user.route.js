const express = require('express');
const userRoute = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../database').secret;
const User = require('../models/User');

/**
 * @route POST user.route/register
 * @desc Register the User
 * @access Public
 */

// Register the User
userRoute.post('/register', (req, res) => {
  let { 
    email, 
    password, 
    confirm_password
   } = req.body
   if(password !== confirm_password){
     return res.status(400).json({
       msg: "Passwords do not match."
     })
   }
   // Check for unique Email
   User.findOne({
     email: email
    }).then(user =>{
      if(user){
        return res.status(400).json({
          msg: "An account is already associated with this email"
        });
      }
   });
   // Register valid new user
   let newUser = new User({
     email,
     password
   });
   // Hash the password
   bcrypt.genSalt(10, (err, salt) =>{
     bcrypt.hash(newUser.password, salt, (err, hash) =>{
       if(err) throw err;
       newUser.password = hash;
       newUser.save().then(user =>{
         return res.status(201).json({
           success: true,
           msg: "Account created."
         });
       });
     });
   });
 });

 /**
 * @route POST user.route/login
 * @desc Signing in the User
 * @access Public
 */

 // Login user
 userRoute.post('/login', (req, res) => {
  User.findOne({
     email: req.body.email 
  }).then(user => {
    if (!user) {
      return res.status(404).json({
        msg: "No account associated with this email address.",
        sucess: false
      });
    }
    // Confirm password for given user
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if(isMatch){
        // Send JSON Token to user
        const payload = {
          _id: user._id,
          name: user.email
        }
        jwt.sign(payload, key, {
           expiresIn: 604800
          }, (err, token) => {
            res.status(200).json({
              success: true,
              token: `Bearer ${token}`,
              msg: "You are succesfully logged in."
            });
          })
      } else {
        return res.status(404).json({
          msg: "Incorrect password.",
          success: false
        });
      }
    })
  });
});

 /**
 * @route POST user.route/profile
 * @desc Return the User's data
 * @access Private
 */
// Create protected route
userRoute.get('/profile', passport.authenticate('jwt', {
  session: false 
}), (req, res) => {
    return res.json({
      user: req.user
    });
});

module.exports = userRoute;