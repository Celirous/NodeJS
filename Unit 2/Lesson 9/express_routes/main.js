const port = 3000;
const express = require("express");
const homeController = require("./controllers/homeController");
const app = express();

//this is middleware, it is the thing that makes it so that you can communicate with the server
app.use((req, res, next) => {
  //Define a middleware function. Code is read from top to bottom, the middleware must be on the top of the code
  console.log(
    `This is the first middleware that will be running. Request made to: ${req.url}`
  ); //log the request’s path to console.
  next(); //Call the next middleware function.
});

app.use((req, res, next) => {
  console.log(
    `This is the second middleware that will be running. Request made to: ${req.url}`
  );
  next();
});

app.use(
  express.urlencoded({ // this takes the data from raw binary data into a javascript object so that it is readable.
    extended: false,
  })
);
app.use(express.json()); 

app.get("/items/:vegetable", homeController.sendReqParams);


app.post("/", homeController.sendPostReq);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
