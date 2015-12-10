var express = require('express');
var router = express.Router();
var testIndex = require('../model/bookmarks');

router.get('/query', function(req, res, next) {
	testIndex.query(req,res,next);
});

router.delete('/delete/:id', function(req, res, next) {
  testIndex.delete(req,res,next);
});

router.post('/add', function(req, res, next) {
  testIndex.add(req,res,next);
});
module.exports = router;
