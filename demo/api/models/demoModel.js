'use strict'; // Bad syntax = Errors
var mongoose = require('mongoose'); // Used to interact with mongoDB
var Schema = mongoose.Schema;


// The Schema is the message schema for a message in the API.
var LoginSchema = new Schema({
  user_name: {
    type: String,
    required: 'Please enter a user name'
  },
  password: {
    type: String,
    required: 'Please enter a password'
  }
});

// Publicize our message schema.
module.exports = mongoose.model('login', LoginSchema);
