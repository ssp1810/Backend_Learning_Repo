import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

//connecting local mongodb compass
//for online cloud use mongodb atlas
mongoose.connect("mongodb://127.0.0.1:27017", {
      dbName: "backend",
})
.then(() => console.log("Database connected"))
.catch((e) => console.log(e));

const userSchema = mongoose.Schema({
      name: String,
      email: String
});

//creating model
const User = mongoose.model("User", userSchema);


const app = express();
const users = [];

//middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({extended: true}))
app.use(cookieParser()); 

//setting up view engine
app.set("view engine", "ejs");

//api for login (authentication)
app.post("/login", (req, res) => {

      console.log(res.json(req.body));

      //set cookies
      res.cookie("token", "iamin", {
            httpOnly: true,
            expires: new Date(Date.now() + 60*1000),
      });
      res.redirect("/");
})

//** user defined middleware for login authentication
const isAuthenticated = (req, res, next) => {
      const token = req.cookies.token;
      console.log(token);

      if(token){
            next();
      }
      else{
            res.render("login");
      }
}

app.get("/", isAuthenticated, (req, res, next) => {
      res.render("logout");
})

app.get("/logout", (req, res) => {
      res.cookie("token", null, {
            httpOnly: true,
            expires: new Date(Date.now()),
      })
      res.redirect("/");
})

app.listen(5000, () => {
      console.log("contact form is working");
})