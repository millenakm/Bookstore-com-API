var express = require('express');
var router = express.Router();
var fs = require('fs');
// jquery
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);

var isbn;

router.get('/:cod', function(req, res, next) {
	var cod = req.params.cod;
	var api='https://www.googleapis.com/books/v1/volumes/'+cod;



	$.get(api, function(data){
		res.render('./catalogo/produto', {title: "Bookstore - ", data: data});
		res.end();
  	});
		
});


module.exports = router;