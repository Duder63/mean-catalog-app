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
  catalogImageURL: {
    type: String,
    default: 'modules/catalogs/client/img/saveme-placeholder.png'
  },
  manufacturer: {
    type: String,
    trim: true
  },
  modelnumber: {
    type: String,
    trim: true
  },
  serialnumber: {
    type: String,
    trim: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  itemValue: {
    type: Number,
    trim: true,
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
