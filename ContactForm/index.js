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

// const schema = mongoose.Schema({
//       name: String,
//       email: String
// });

const userSchema = new mongoose.Schema({
      name: String,
      email: String
});

//creating model
// const msg = mongoose.model("Message", schema);
const User = mongoose.model("User", userSchema);


const app = express();
const users = [];

//for accessing static data from public folder
//index.html is accessed from public 
//2nd middleware for post method
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({extended: true}))
app.use(cookieParser()); 

//setting up view engine
app.set("view engine", "ejs");

// app.get("/", (req, res) => {
//       res.render("login")
// });

//api for /success route
app.get("/success", (req, res) => {
      res.render("success");
})

//starting point of form 
//creating api for post method
app.post("/contact", async (req, res) => {

      // gives output as undefined
      console.log(req.body);
      // to get the data specifically by labels
      console.log(req.body.name);

      //storing data in array

      // users.push({
      //       username: req.body.name,
      //       email: req.body.email
      // });

      // res.render("success");

      //or

      await msg.create({
            name: req.body.name,
            email: req.body.email
      })
      res.redirect("/success");
});

//creating an api for getting data from database to frontend
app.get("/users", (req, res) => {
    res.json({
      users,
    });
});

//api for storing data in db
app.get("/add", (req, res)=>{
      msg.create({
            name: "Shreya",
            email: "sample@gmail.com"
      }).then(() => {
            res.send("Nice");
      })
})

//api for login (authentication)
app.post("/login", (req, res) => {
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

//access cookies on another page
// app.get("/", (req, res) => {

      //this part can also be used as a middleware**

      //to refer to token value
//       const token = req.cookies.token;
//       console.log(token);

//       if(token){
//             res.render("logout");
//       }
//       else{
//             res.render("login");
//       }

//       res.render("login");
// })

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