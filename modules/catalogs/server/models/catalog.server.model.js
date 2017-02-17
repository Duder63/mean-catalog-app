'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Catalog Schema
 */
var CatalogSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill description',
    trim: true
  },  
  category: {
    type: String,
    default: '',
    trim: true
  },
  urlimage: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    default: '',
    trim: true
  },
  modelnumber: {
    type: String,
    default: '',
    trim: true
  },
  serialnumber: {
    type: String,
    default: '',
    trim: true
  },
  purchaseDate: {
    type: Date,
    default: ''
    // default: Date.now
  },
  itemValue: {
    type: Number,
    trim: true,
    default: '',
    min: 0,
    max: 1000000
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Catalog', CatalogSchema);
