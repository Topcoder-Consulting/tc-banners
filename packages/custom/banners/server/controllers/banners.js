'use strict';

var _ = require('lodash');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Banner = mongoose.model('Banner'),
  _ = require('lodash');


/**
 * Find banner by id
 */
exports.banner = function(req, res, next, id) {
  Banner.load(id, function(err, banner) {
    if (err) return next(err);
    if (!banner) return next(new Error('Failed to load banner ' + id));
    req.banner = banner;
    next();
  });
};

/**
 * Create an banner
 */
exports.create = function(req, res) {
  var banner = new Banner(req.body);

  banner.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot save the banner'
      });
    }
    res.json(banner);

  });
};

/**
 * Update an banner
 */
exports.update = function(req, res) {
  var banner = req.banner;

  banner = _.extend(banner, req.body);

  banner.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the banner'
      });
    }
    res.json(banner);

  });
};

/**
 * Delete an banner
 */
exports.destroy = function(req, res) {
  var banner = req.banner;

  banner.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the banner'
      });
    }
    res.json(banner);

  });
};

/**
 * Show an banner
 */
exports.show = function(req, res) {
  res.json(req.banner);
};

/**
 * List of Banners
 */
exports.all = function(req, res) {
  Banner.find().sort('-created').populate('user', 'name username').exec(function(err, banners) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the banners'
      });
    }
    res.json(banners);

  });
};

/**
 * Serve up a banner
 */
exports.serve = function(req, res) {
  var query = _.defaults({ 'isActive': true,
      'starts' : { '$lte' : new Date() }, 'ends' : { '$gte' : new Date() } },
    req.query);

  Banner.count(query, function(err, ct) {
    var r = Math.floor(Math.random() * ct);

    // define an empty banner to return of nothing found
    var b = {
      id: '',
      imageUrl: '',
      url: '',
      alt: '',
      width: 0,
      height: 0
    };

    Banner.findOne(query).limit(1).skip(r).exec(function(err, banner) {
      if (err) {
        return res.status(500).json({
          error: 'Cannot serve banner'
        });
      }
      if (banner !== null) {
        // save the impression
        banner.impressions = banner.impressions + 1;
        banner.save();
        console.log(banner);
        // add the banner data needed
        b = {
          id: banner.id,
          imageUrl: banner.imageUrl,
          url: process.env.APP_URL,
          alt: banner.alt,
          width: banner.size.substring(0,banner.size.indexOf('x')),
          height: banner.size.substring(banner.size.indexOf('x')+1,banner.size.length)
        };
      }
      res.render('banner', b);
    });
  });
};

/**
 * Click a banner
 */
exports.click = function(req, res) {
  console.log(req.query.id);
  Banner.findByIdAndUpdate(req.query.id, { $inc: { clicks: 1 }}, function (err, banner){
    console.log(banner);
    console.log('Redirecting to: '+banner.targetUrl);
    res.redirect(banner.targetUrl);
  });
};
