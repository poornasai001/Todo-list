const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let items = [
  { id: 1, task: "working", priority: "high", completed: false },
  { id: 2, task: "Sample task", priority: "medium", completed: false }
];
let currentId = 3;

app.get("/", function (req, res) {
  let filteredItems = items;
  const filterPriority = req.query.priority;

  if (filterPriority && filterPriority !== "all") {
    filteredItems = items.filter((item) => item.priority === filterPriority);
  }

  res.render("list", {
    listTitle: "Todo List",
    newListItems: filteredItems,
    selectedPriority: filterPriority || "all",
    query: req.query,
    error: req.query.error
  });
});

app.post("/", function (req, res) {
  const item = req.body.ele1;
  const priority = req.body.priority || "medium";

  if (!item || item.trim() === "") {
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

app.post("/toggle/:id", function (req, res) {
  const itemId = parseInt(req.params.id);
  const item = items.find((item) => item.id === itemId);
  if (item) {
    item.completed = !item.completed;
  }
  res.redirect("/");
});

app.put("/edit/:id", function (req, res) {
  const itemId = parseInt(req.params.id);
  const item = items.find((item) => item.id === itemId);
  if (item) {
    if (req.body.editTask && req.body.editTask.trim() !== "") {
      item.task = req.body.editTask.trim();
      item.priority = req.body.editPriority || item.priority;
    }
  }
  res.redirect("/");
});

app.delete("/delete/:id", function (req, res) {
  const itemId = parseInt(req.params.id);
  const index = items.findIndex((item) => item.id === itemId);
  if (index > -1) {
    items.splice(index, 1);
  }
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started");
});
