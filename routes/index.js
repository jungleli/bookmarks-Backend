var express = require('express');
var router = express.Router();
var testIndex = require('../model/bookmarks');

/* GET home page. */
router.get('/query', function(req, res, next) {
	testIndex.query(req,res,next);
  // res.render('index', { title: 'Express' });
});


router.delete('/delete/:id', function(req, res, next) {
  testIndex.delete(req,res,next);
  // res.render('index', { title: 'Express' });
});

router.post('/add', function(req, res, next) {
  console.log("#######################add testcase");
  testIndex.add(req,res,next);
  console.log("#######################add testcase");
  // res.render('index', { title: 'Express' });
});

// router.get('/list', function(req, res, next) {
// 	var db = req.db;
// 	var collection = db.get('bookmark');
// 	collection.find({},{},function(e,docs){
// 		res.render('list',{
// 			"list" : docs
// 		});
// 	});
//   // res.render('index', { title: 'Express' });
// });


// // get New page
// // router.get('/add', function(req, res) {


// //     res.render('addBookmark.html');
// // });


// router.post('/listpage', function(req, res, next) {

//   var mongodb = require('mongodb');   
//   var page = req.params.page;  //取得page的值,注意route中的配置,可以有可以没有这个page 
//   var total; //分页的总数 
//   var pagenum =4; //分页的条数 
//   if(page){ 
//     page = page; 
//   }else{ 
//     page = 1; 
//   } 
    
//   var db = req.db;
//     var collection = db.get('bookmark');
//     collection.count(function(err, count){
//         total = count;
//     });
//     collection.find().limit(pagenum).skip(pagenum*(page-1)).toArray(function(err,results){
//         if(results.length){ 
//               if(page==1){ 
//                 var prevpage = page; 
//               }else{ 
//                 var prevpage = page-1; 
//               } 
                   
//               if(page == Math.ceil(total/pagenum)){ 
//                 var nextpage = Math.ceil(total/pagenum); 
//               }else{ 
   
//                 var nextpage = parseInt(page)+1; 
//               }
//           }
//           else{
//             console.log("no data");
//                }
//     });
//     // collection.find({},{},function(e,docs){
//     //     res.render('list',{
//     //         "list" : docs
//     //     });

//   // res.render('index', { title: 'Express' });
// });



// /* POST to Add User Service */
// router.post('/add', function(req, res) {

//     // Set our internal DB variable
//     var db = req.db;

//     // Get our form values. These rely on the "name" attributes
//     var title = req.body.title;
//     var created = req.body.created;

//     // Set our collection
//     var collection = db.get('bookmark');

//     // Submit to the DB
//     collection.insert({
//         "title" : title,
//         "created" : created
//     }, function (err, doc) {
//         if (err) {
//             // If it failed, return error
//             res.send("There was a problem adding the information to the database.");
//         }
//         else {
//             // And forward to success page
//             res.redirect("list");
//         }
//     });
// });


module.exports = router;
