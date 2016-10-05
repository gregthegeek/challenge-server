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
  const orig = req.file.buffer;
  const key = new NodeRSA(req.user.pubKey);
  const enc = key.encrypt(orig, 'utf8');

  res.setHeader('Content-disposition', 'attachment; filename=' + req.file.originalname);
  res.send(enc);
};

exports.decrypt = (req, res) => {
  console.log('pub', req.user.pubKey);
  const keyFile = req.files.key[0];
  const fileFile = req.files.file[0];

  console.log('key', keyFile.buffer.toString('utf8'));
  const key = new NodeRSA(keyFile.buffer.toString('utf8'));
  const dec = key.decrypt(fileFile.buffer, 'utf8');

  res.setHeader('Content-disposition', 'attachment; filename=' + fileFile.originalName);
  res.send(dec);
};
