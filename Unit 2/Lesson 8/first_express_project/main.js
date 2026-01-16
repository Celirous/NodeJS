const port = 3000;
const express = require("express"); //You require Express.js by referring to the module name express and storing it as a constant '.express' offers a library of methods and functionality,including a class with builtin web server functionality. The .express function will return an object. 
const app = express(); // the instance of the .express is now sitting in app. This now has access to all the .express methods. 
// we call the express function whitch returns an object we store in the app variable. The returned object is known as an express application or express instance. It will then have access to methods from express, like web functionality eg, web server functionality methods like .get request. Like .listen to wait for a request 

app
  .get("/", (req, res) => {
    console.log("Params: ", req.params);
    console.log("Body: ", req.body);
    console.log("URL: ", req.url);
    console.log("Query: ", req.query);

    res.send("Hello, Universe!"); //the .send will just send the string over to the browser 
  })
  .listen(port, () => {  // once the .listen activates it creates the server and can now waits for incoming requests on port 3000 (the local host in this case)
    console.log(`The Express.js server has started and is listening on port number: ${port}`);
  });
