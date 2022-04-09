//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const constant = require(__dirname + "/constant.js");

const homeStartingContent = "Welcome to my blog!";
const aboutContent = "About Me";
const contactContent = "My Contact Information";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(`mongodb+srv://${constant.mongoDBCredentials}@cluster0.mqqyx.mongodb.net/blogDB`);

const postSchema = {
  postTitle : {
    type : String,
    require : true
  },
  postContent : {
    type: String,
    require : true
  }
};

const Post = mongoose.model("Post", postSchema);

app.get("/",function(req,res){

  Post.find({},function(err,foundPosts){
    if(!err){
      res.render("home", {
        homeContent : homeStartingContent,
        posts : foundPosts
      });
    }else{
      console.log(err);
    }
  });


})

app.get("/post/:id", function(req,res){

  const postID = req.params.id;

  Post.findById(postID, function(err,foundPost){
    res.render("post", {postTitle: foundPost.postTitle, postContent : foundPost.postContent});
  });

})

app.get("/about", function(req,res){
  res.render("about", {aboutContent: aboutContent});
})

app.get("/contact", function(req,res){
  res.render("contact", {contactContent: contactContent});
})

app.get("/compose", function(req,res){
  res.render("compose");
})

app.post("/compose", function(req, res){

  const post = new Post ({
    postTitle : req.body.postTitle,
    postContent : req.body.postContent
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }else{
      console.log(err);
    }
  });

})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
