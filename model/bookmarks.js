var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/bookmarks');

module.exports = {
	query : function(req,res,next){
    var rQuery = req.query || {};
    var page = rQuery.page || 1;
    var rows = rQuery.rows || 10;
    var queryKey = rQuery.key || "";

    var collection = db.get("bookmark");
    
    collection.find(
        {'title': {$regex:queryKey,$options:'i'}},
        {sort:{created : -1},limit: rows, skip:(page-1)*rows},
        function(err,result){
            if(err){
            res.send(err);
        }else{
            collection.find({'title': {$regex:queryKey,$options:'i'}},{sort:{created:-1}},function(e,docs){
            jsonArray={items:result,total:docs.length};
            res.json(jsonArray);
            });
        }
    });
	},

	delete : function(req,res,next){
	    var collection = db.get('bookmark');
	    
	    var itemToDelete = req.params.id  || req.query.id;
	    collection.remove({ '_id' : itemToDelete }, function(err) {
	    	console.log(err);
	        res.send((err === null) ? { status:'success',msg: 'Deleted success!' }
                : {status:'failed', msg:'Deleted fail! Check the reason ' + err });
	    });
	},

	add : function(req,res,next){
	    var collection = db.get('bookmark');

		var param = req.body || req.query || req.params;
    	collection.insert(param, function(err, result){
        res.send(
            (err === null) ? {status:'success', msg: 'Add success!' }
                : { status:'failed',msg: 'Add fail! Check the reason' +  err }
        );
    });
	}
}