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
    required: 'Please fill Catalog name',
    trim: true
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
