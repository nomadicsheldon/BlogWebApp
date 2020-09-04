//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

// ############################## setting up frameworks ##############################
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// ############################## global static values ##############################
const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const aboutContent = "Vivamus arcu felis bibendum ut. Quam viverra orci sagittis eu. Malesuada pellentesque elit eget gravida cum. Nam aliquam sem et tortor consequat id porta nibh. Nunc non blandit massa enim nec dui nunc mattis. Erat pellentesque adipiscing commodo elit at. Semper auctor neque vitae tempus quam pellentesque nec nam aliquam. At volutpat diam ut venenatis tellus in metus vulputate eu. Dictum at tempor commodo ullamcorper a lacus vestibulum. Neque gravida in fermentum et sollicitudin ac orci phasellus egestas. Sit amet risus nullam eget felis eget nunc. Elit ut aliquam purus sit amet luctus venenatis lectus. Viverra justo nec ultrices dui sapien. Non curabitur gravida arcu ac tortor dignissim convallis aenean. Malesuada fames ac turpis egestas. Augue ut lectus arcu bibendum at varius. Bibendum at varius vel pharetra.";
const contactContent = "Ornare aenean euismod elementum nisi. Est ullamcorper eget nulla facilisi etiam dignissim diam quis. Blandit turpis cursus in hac habitasse platea dictumst. Eget nunc scelerisque viverra mauris. Vel pharetra vel turpis nunc. Nunc non blandit massa enim nec. In cursus turpis massa tincidunt dui ut ornare. Dui vivamus arcu felis bibendum ut tristique et egestas quis. Lacinia quis vel eros donec ac. Fames ac turpis egestas sed. Ut ornare lectus sit amet est placerat. Libero nunc consequat interdum varius. Nulla at volutpat diam ut venenatis tellus in metus vulputate. Cursus risus at ultrices mi tempus imperdiet nulla. Fermentum leo vel orci porta non pulvinar neque. Diam vel quam elementum pulvinar etiam non quam lacus. Placerat vestibulum lectus mauris ultrices eros in cursus turpis.";
//######################## mongoose setup with dbName ########################
const mongoose = require('mongoose');

// connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = 'blogDB';

// mongoose.connect("mongodb://localhost:27017/fruitsDB");
mongoose.connect(url + "/" + dbName, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// Creating Schema
const blogSchema = {
  title: String,
  content: String
};
// Creating Model by using schema, in DB blog will be pluralise
const Blog = mongoose.model('Blog', blogSchema);

// ############################## Home route ##############################
app.get("/", function(req, res) {
  Blog.find(function(err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    }
  });
});

// ############################## About route ##############################
app.get("/about", function(req, res) {
  res.render('about', {
    aboutContent: aboutContent
  });
});

// ############################## post route ##############################
// dynamic url, express way 👉
app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  Blog.findOne({
    _id: requestedPostId
  }, function(err, post) {
    res.render('post', {
      title: post.title,
      content: post.content
    });
  });
});

// ############################## Contact route ##############################
app.get("/contact", function(req, res) {
  res.render('contact', {
    contactContent: contactContent
  });
});

// ############################## Compose route ##############################
app.get("/compose", function(req, res) {
  res.render('compose');
});

app.post("/compose", function(req, res) {
  // saving in mongodb
  const newBlog = new Blog({
    title: req.body.postTitle,
    content: req.body.postContent
  });
  newBlog.save(function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("saved in mongodb");
      res.redirect("/");
    }

  });
  //
});

// ############################## port setting ##############################
app.listen(3000, function() {
  console.log("Listening for BlogWebApp started on port 3000");
});
