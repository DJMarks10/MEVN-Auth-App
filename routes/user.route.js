const express = require('express');
const userRoute = express.Router();

// model
let UserModel = require('../models/User');

// inserts user into database
userRoute.route('/create-user').post((req, res, next) => {
  UserModel.create(req.body, (error, data) => {
  if (error) {
    return next(error)
  } else {
    res.json(data)
  }
})
});

// retrieves ALL job posts
userRoute.route('/').get((req, res, next) => {
    UserModel.find((error, data) => {
     if (error) {
       return next(error)
     } else {
       res.json(data)
     }
   })
 })

// edits job post
userRoute.route('/edit-user/:id').get((req, res, next) => {
   UserModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update
userRoute.route('/update-user/:id').post((req, res, next) => {
  UserModel.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
    }
  })
})

// Delete
userRoute.route('/delete-user/:id').delete((req, res, next) => {
  UserModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = userRoute;