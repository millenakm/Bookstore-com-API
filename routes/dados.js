var express = require('express');
var router = express.Router();
var fs = require('fs');
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);

/* GET home page. */
router.get('/', function(req, res, next) {
	$.get('https://www.googleapis.com/books/v1/volumes?q=inpublisher:&%20key%20=%20AIzaSyD0oBpbiiHTaxdpEjo79ReqLNZlry1CYcs', function(data){
		res.json(data.items);
	});
});

module.exports = router;