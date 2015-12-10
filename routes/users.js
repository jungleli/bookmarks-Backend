var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('bookmark');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

router.get('/userlist1',function(req, res){
    var db = req.db;
    var collection = db.get("bookmark");
    collection.find({}, {limit: 10, skip:20},function(e,docs){
        res.json(docs);
    });
});
/****************************
get paged list
************************/
router.get('/pagelist',function(req,res){
    var count=0;
    // var page = 1;
    // var rows = 9;

    console.log("++++++++++++++++++++++++++++++++++++++=" + req.query);
    var rQuery = req.query || {};
    var page = rQuery.page || 1;
    var rows = rQuery.rows || 10;
    var queryKey = rQuery.key || "";
     
    var db = req.db;
    var collection = db.get("bookmark");

    // console.log("page:"+page+",rows:"+rows,"title:"+queryKey);
    
    collection.find(
        {},
        {limit: rows, skip:(page-1)*rows},
        function(err,result){
            if(err){
            res.send(err);
        }else{
            collection.find({'title': {$regex:queryKey,$options:'i'}},function(e,docs){
            jsonArray={items:result,total:docs.length};
            res.json(jsonArray);
            });
        }
    });
     
});

/*
router.get('/add', function(req, res) {

var db = req.db;
    var collection = db.get('bookmark');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
    // res.render('addBookmark', { title: 'Add New bookmark' });
});*/


router.post('/addBookmark', function(req, res) {
    var db = req.db;
    var collection = db.get('bookmark');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteBookmark/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('bookmark');
    var itemToDelete = req.params.id;
    collection.remove({ '_id' : itemToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

// router.update('/update/:id',function(req, res){
// 	var db = req.db;
// 	var collection = db.get('bookmark');
// 	var itemToUpdate = req.params.id;
// 	collection.update({'_id':itemToUpdate}, {$set: {}, function(error, bars){});
// })

module.exports = router;
