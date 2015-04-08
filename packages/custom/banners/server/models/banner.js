'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Banner Schema
 */
var BannerSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  targetUrl: {
    type: String,
    required: true,
    trim: true
  },
  alt: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    required: true,
    trim: true,
    default: '322x322'
  },
  campaign: {
    type: String,
    trim: true
  },
  tags: {
    type: Array
  },
  description: {
    type: String,
    trim: true
  },
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  starts: {
    type: Date,
    required: true,
    default: Date.now
  },
  ends: {
    type: Date,
    required: true
  }
});

/**
 * Validations
 */
BannerSchema.path('name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');

BannerSchema.path('imageUrl').validate(function(imageUrl) {
  return !!imageUrl;
}, 'Image URL cannot be blank');

BannerSchema.path('targetUrl').validate(function(targetUrl) {
  return !!targetUrl;
}, 'Target URL cannot be blank');

/**
 * Statics
 */
BannerSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Banner', BannerSchema);