const port = 3000;
  const http = require("http"); // this tells my app that it requres the HTTP module to work 
  const httpStatus = require("http-status-codes"); // this tells my app that it requres the HTTP-STATUS-CODES module to work 

  const app = http.createServer();

// same as with the previous stuff. It listens for an event and receives a request then does something. The server fires the code in a callback function when a request event is triggered
app.on("request", (req, res) => { //this '.on' is the same as a .GET request 
  res.writeHead(httpStatus.StatusCodes.OK, {
    "Content-Type": "text/html", // the requested info will be given in an html format
  });
});

app.on("request", (req, res) => { // Listen for requests.
  let body = []; //Create an array to hold chunk contents.
  req.on("data", (bodyData) => { // Process it in another callback function.
    body.push(bodyData); //Add received data to the body array.
  });
  req.on("end", () => { // Run code when data transmission ends.
    body = Buffer.concat(body).toString(); //Convert the body array to a String of text.
    console.log(`Request Body Contents: ${body}`); // Log the request’s contents to your console.
});

  console.log(`Method: ${getJSONString(req.method)}`); //log the HTTP method used 
  console.log(`URL: ${getJSONString(req.url)}`); //log the request URL
  console.log(`Headers: ${getJSONString(req.headers)}`); //log reqest headers 

  let responseMessage = "<h1>This will show on the screen.</h1><br><p>This will be below</p>";
  // Last, the server sends the HTML content within the parentheses and simultaneously closes the connection with the client.
  res.end(responseMessage); //the res means response. So we are going to respond to the request and display it on the screen. 
});

const getJSONString = obj => {
  return JSON.stringify(obj, null, 2);
};

app.listen(port);
console.log(`The server has started and is listening on port number: ${port}`);
