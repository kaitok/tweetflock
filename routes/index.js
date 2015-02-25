var express = require('express');
var router = express.Router();
var sockets = require('./sockets');

router.use('/', sockets);

module.exports = router;