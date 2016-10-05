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

exports.encrypt = (req, res) => {
  console.log('req.file', req.file);
  const orig = req.file.buffer;
  const enc = crypto.publicEncrypt(req.user.pubKey, orig);

  // TODO escape or change filename (for security purposes)
  res.setHeader('Content-disposition', 'attachment; filename=' + req.file.originalname);
  res.send(enc);
};
