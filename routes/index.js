var express = require('express');
var router = express.Router();
var mongo=require('mongodb').MongoClient;
var ObjectId=require('mongodb').ObjectID;
var assert=require('assert');
const { disabled } = require('../app');

var url='mongodb://localhost:27017/test';

/* GET home page. */
router.route('/')
.all((req,res,next)=>{
  res.render('index');
})

router.route('/get-data')
.get((req,res,next)=>{
  var resultArray=[]
  mongo.connect(url,(err,db)=>{
    assert.equal(null,err);
    var cursor=db.collection("user-data").find();
    cursor.forEach((doc,err)=>{
      assert.equal(null,err);
      resultArray.push(doc);
    },()=>{
      db.close();
      res.render('index',{items:resultArray})
    });
  })
})

router.route('/insert')
.post((req,res)=>{
  var item={
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  mongo.connect(url,(err,db)=>{
    assert.equal(null,err);
    db.collection("user-data").insertOne(item,(err,result)=>{
      assert.equal(null,err);
      console.log("Item Inserted");
      db.close();
    })
  });
  res.redirect('/');
});

router.route('/update')
.post((req,res)=>{
  var item={
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  }
  var id =req.body.id;
  mongo.connect(url,(err,db)=>{
    assert.equal(null,err);
    db.collection("user-data").updateOne({"_id":ObjectId(id)},{$set:item},(err,result)=>{
      assert.equal(null,err);
      console.log("Item Inserted");
      db.close();
    })
  });
  res.redirect('/');
});

router.route('/delete')
.delete((req,res)=>{
  var id =req.body.id;
  mongo.connect(url,(err,db)=>{
    assert.equal(null,err);
    db.collection("user-data").deleteOne({"_id":ObjectId(id)},(err,result)=>{
      assert.equal(null,err);
      console.log("Item Deleted");
      db.close();
    });
  });
  res.redirect('/');
});
module.exports = router;
