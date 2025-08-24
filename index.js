const express = require("express");
const bodyParser = require("body-parser");

var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

var items = [
    {id: 1, task: "working", priority: "high", completed: false},
    {id: 2, task: "Sample task", priority: "medium", completed: false}
];
var currentId = 3;

app.get("/", function(req, res) {
    let filteredItems = items;
    const filterPriority = req.query.priority;
    
    if (filterPriority && filterPriority !== 'all') {
        filteredItems = items.filter(item => item.priority === filterPriority);
    }
    
    res.render("list", {
        listTitle: "Todo List", 
        newListItems: filteredItems,
        selectedPriority: filterPriority || 'all',
        query: req.query
    });
});

app.post("/", function(req, res) {
    var item = req.body.ele1;
    var priority = req.body.priority || 'medium';
    
    if (!item || item.trim() === '') {
        return res.redirect("/?error=empty");
    }
    
    items.push({
        id: currentId++,
        task: item.trim(),
        priority: priority,
        completed: false
    });
    
    res.redirect("/");
});

app.post("/toggle/:id", function(req, res) {
    const itemId = parseInt(req.params.id);
    const item = items.find(item => item.id === itemId);
    
    if (item) {
        item.completed = !item.completed;
    }
    
    res.redirect("/");
});

app.post("/edit/:id", function(req, res) {
    const itemId = parseInt(req.params.id);
    const item = items.find(item => item.id === itemId);
    
    if (item && req.body.editTask && req.body.editTask.trim() !== '') {
        item.task = req.body.editTask.trim();
        item.priority = req.body.editPriority || item.priority;
    }
    
    res.redirect("/");
});

app.post("/delete/:id", function(req, res) {
    const itemId = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        items.splice(itemIndex, 1);
    }
    
    res.redirect("/");
});

app.listen(3000, function() {
    console.log("Server started");
});