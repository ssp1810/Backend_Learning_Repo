import express from "express";
import path from "path";

const app = express();

//for accessing static data from public folder
//index.html is accessed from public 
app.use(express.static(path.join(path.resolve(), "public")));

//setting up view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
      res.render("index", {name: "Shreya"});
});

app.listen(5000, () => {
      console.log("app is working");
})