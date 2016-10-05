'use strict';

const crypto = require('crypto');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  if (!req.user) {
    res.redirect('/login');
    return;
  }

  res.render('home', {
    title: 'Home'
  });
};

exports.genKeys = (req, res) => {
  const dh = crypto.createDiffieHellman(1024); // TODO increase
  req.user.pubKey = dh.generateKeys('hex');
  req.user.save();

  const privKey = dh.getPrivateKey('hex');
  res.setHeader('Content-disposition', 'attachment; filename=privkey.txt');
  res.send(privKey);
};
