// const http = require('http');
// const gfname = require('./feature');  //file based module
import http from 'http';
import gfname, {randomLovePercent} from './feature.js';

//inbuilt api
import fs from 'fs';

fs.readFile('./index.html', () => {
      console.log("file read");
})

import path from 'path';
console.log(path.dirname('/home/random/index.html'));
console.log(path.extname('/home/random/index.html'));

console.log(randomLovePercent());
console.log(gfname);
const server = http.createServer((req, res) => {
      console.log(req.url);

      //routing done from page to page manually
       
      // if(req.url === "/about"){
      //       res.end("<h1>about page</h1>");
      // }
      // if(req.url === "/"){
      //       res.end("<h1>home</h1>");
      // }
      // if(req.url === "/contact"){
      //       res.end("<h1>contact page</h1>");
      // }
      // else{
      //       res.end("404 page not found :( !!!")
      // }
})

server.listen(8080, ()=>{
      console.log("Server is working");
});
