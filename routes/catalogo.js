var express = require('express');
var router = express.Router();
var fs = require('fs');
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);

/* GET home page. */
router.get('/', function(req, res, next) {
	
		res.render('catalogo/index')

});

module.exports = router;