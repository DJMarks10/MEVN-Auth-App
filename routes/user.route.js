const express = require('express');
const userRoute = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
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
   //Register valid new user
   let newUser = new User({
     email,
     password
   });
   //Hash the password
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

module.exports = userRoute;