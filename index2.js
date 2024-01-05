import express from "express";
import path from 'path';
const app = express();

app.get("/", (req, res) => {
      //send data in body of the browser
      // res.send("Heyy");

      //set the statuscode
      // res.statusCode = 404;

      //send the status code
      // res.sendStatus(404);

      //send the data in json format: creating an api
      // res.json({
      //       success: true,
      //       products: []
      // });

      //set status code and status msg 
      // res.status(400).send("meri marzi!!");
});

app.get("/getproducts", (req, res) => {
      //gives absolute path of current directory
      console.log(path.resolve());

      //get the path for current file
      //and display content of file
      const pathlocation = path.resolve();
      res.sendFile(path.join(pathlocation, "./index.html"));

});

app.listen(5000, () => {
      console.log("app is working");
})