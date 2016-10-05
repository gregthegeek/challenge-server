'use strict';

const NodeRSA = require('node-rsa');

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
  const key = new NodeRSA({b: 512});
  req.user.pubKey = key.exportKey('public');
  req.user.save();

  const privKey = key.exportKey('private');
  res.setHeader('Content-disposition', 'attachment; filename=privkey.txt');
  res.send(privKey);
};

exports.encrypt = (req, res) => {
  console.log('req.file', req.file);
  const orig = req.file.buffer;
  const key = new NodeRSA(req.user.pubKey);
  const enc = key.encrypt(orig, 'utf8');

  // TODO escape or change filename (for security purposes)
  res.setHeader('Content-disposition', 'attachment; filename=' + req.file.originalname);
  res.send(enc);
};
