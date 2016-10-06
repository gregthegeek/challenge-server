'use strict';

const NodeRSA = require('node-rsa');
const _ = require('lodash');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  if (!req.user) {
    res.redirect('/login');
    return;
  }

  // limit displayed length of each key
  const prefix = '-----BEGIN PUBLIC KEY----- '.length;
  const pubKeys = _.map(req.user.pubKeys, function(pubKey) {
    return pubKey.substring(prefix, prefix + 50) + '...';
  });

  res.render('home', {
    title: 'Home',
    pubKeys: pubKeys
  });
};

exports.genKeys = (req, res) => {
  const key = new NodeRSA({b: 512});
  req.user.pubKeys = req.user.pubKeys || [];
  const num = req.user.pubKeys.push(key.exportKey('public'));
  req.user.save();

  const privKey = key.exportKey('private');
  res.setHeader('Content-disposition', 'attachment; filename=privkey-' + num + '.txt');
  res.send(privKey);
};

exports.encrypt = (req, res) => {
  const orig = req.file.buffer;
  const key = new NodeRSA(req.user.pubKeys[parseInt(req.body.pubChoice, 10)]);
  const enc = key.encrypt(orig, 'utf8');

  res.setHeader('Content-disposition', 'attachment; filename=' + req.file.originalname);
  res.send(enc);
};

exports.decrypt = (req, res) => {
  console.log('pub', req.user.pubKeys);
  const keyFile = req.files.key[0];
  const fileFile = req.files.file[0];

  const key = new NodeRSA(keyFile.buffer);
  console.log('exported', key.exportKey('public'));
  const dec = key.decrypt(fileFile.buffer, 'utf8');

  res.setHeader('Content-disposition', 'attachment; filename=' + fileFile.originalName);
  res.send(dec);
};
