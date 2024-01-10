import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//connecting local mongodb compass
//for online cloud use mongodb atlas
mongoose.connect("mongodb://127.0.0.1:27017", {
      dbName: "backend",
})
      .then(() => console.log("Database connected"))
      .catch((e) => console.log(e));

const userSchema = mongoose.Schema({
      name: String,
      email: String,
      password: String,
});

//creating model
const User = mongoose.model("User", userSchema);


const app = express();
const users = [];

//middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

//setting up view engine
app.set("view engine", "ejs");

app.get("/register", (req, res) => {
      res.render("register");
})

app.get("/login", (req, res) => {
      res.render("login");
})

//api for register
app.post("/register", async (req, res) => {

      const { name, email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) {
            //if user exist then redirect to login
            res.redirect("/login");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
            name,
            email,
            password: hashedPassword,
      });

      //creating token to store user id
      const token = jwt.sign({ _id: user._id }, "akfenibvairugb");

      //setting cookies using token
      res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 1000),
      });
      res.redirect("/");


})


//api for login (authentication)
app.post("/login", async (req, res) => {

      const { email, password } = req.body;
      let user = await User.findOne({ email });

      if (!user) {
            console.log("Don't have an account, register first!");
            res.redirect("/register");
      }

      //for normal comparsion of password
      // const isMatch = User.password === password;

      //for hashed password value comparision
      const isMatch = await bcrypt.compare(password, User.password);
      if (!isMatch) {
            return res.render("login", { email, message: "Incorrect Password" });
      }

      //creating token to store user id

      const token = jwt.sign({ _id: user._id }, "akfenibvairugb");

      //setting cookies using token
      res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 1000),
      });
      res.redirect("/");

      //not required to create document if user already exists
      //and want to login only


      // else {
      //       console.log("Successfully logged in!")
      //       user = await User.create({
      //             name,
      //             email,
      //             password
      //       });



      //set cookies

      // res.cookie("token", user._id, {
      //       httpOnly: true,
      //       expires: new Date(Date.now() + 60*1000),
      // });
      // res.redirect("/");
})

//** user defined middleware for login authentication
const isAuthenticated = async (req, res, next) => {
      const token = req.cookies.token;

      if (token) {

            //if authenicate data then user id is decoded using token and secret msg
            const decoded = jwt.verify(token, "akfenibvairugb");

            //here the user info is saved forever
            //this can be used in any other handler for further use
            req.user = await User.findById(decoded._id);
            next();
      }
      else {
            res.redirect("/login");
      }
}


app.get("/", isAuthenticated, (req, res, next) => {
      res.render("logout", { name: req.user.name });
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