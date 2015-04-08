'use strict';

var banners = require('../controllers/banners');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.article.user.id !== req.user.id) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(Banners, app, auth) {

  app.route('/banners')
    .get(banners.all)
    .post(auth.requiresLogin, banners.create);
  app.route('/banners/:bannerId')
    .get(auth.isMongoId, banners.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, banners.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, banners.destroy);

  // serve up a random banner
  app.route('/serve').get(banners.serve);
  // record the click and redirect
  app.route('/click').get(banners.click);

  // Finish with setting up the articleId param
  app.param('bannerId', banners.banner);
};
