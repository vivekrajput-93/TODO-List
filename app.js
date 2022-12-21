//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//Database set up to connect with the TODO List

mongoose.set('strictQuery', true);
const DB = ("mongodb+srv://viveksingh_93:viveksingh_93@cluster0.wuii8wc.mongodb.net/?retryWrites=true&w=majority");
mongoose.connect(DB, {useNewUrlParser : true});


const itemSchema  = new mongoose.Schema({
  name : String

});

const Item = new mongoose.model("Item", itemSchema);


// Created default item for the list
const  item1 = new Item ({
  name : "Welcome to your new Todolist!"
});

const item2 = new Item({
  name : "Hit the + button to add a new item."
});

const item3 = new Item ({
  name : "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];



// To check if list is empty..if list is empty, then insert new item
app.get("/", function(req, res) {

Item.find({}, function(err, foundItems){

  if(foundItems.length === 0){
    Item.insertMany(defaultItems, function(err){
  if(err){
    console.log(err);
  } else {
    console.log("Successfully saved default Items to DB");
  }
});
res.redirect("/");
  } else {
  res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
})
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

const item = new Item({
  name : itemName
})

item.save();

res.redirect("/");

});


// To delete item from the list..

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log("Successfull");
      res.redirect("/")
    }
  })
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
