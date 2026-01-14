const port = 3000;
const http = require("http"); // Require the http module. this is a core node module so we dont need to install it
const httpStatus = require("http-status-codes"); // Require the http-status-codes module.

const fs = require("fs"); // Require the fs module. File System module, this is a core node module so we dont need to install it. fs, which interacts with the filesystem on behalf of your application. Through the fs module, your server can access and read your index.html or static files
const { error } = require("console");

// EXAMPLE 1
//===========
// const routeMap = { //Then create a routeMap to pair routes with files on your server.
//   "/": "views/index.html", // '/' is the route and then it checks sub folders and files from there, in this case it is views/index.html. This is a hardcoded route that it MUST take.
// };
// http
//   .createServer((req, res) => {
//     res.writeHead(httpStatus.StatusCodes.OK, {
//       "Content-Type": "text/html",
//     });
//     if (routeMap[req.url]) {
//       fs.readFile(routeMap[req.url], (error, data) => { //Read the contents of the mapped file.
//         res.write(data);
//         res.end(); //Respond with file contents. (output content)
//       });
//     } else { // if the file is not found it will display the following
//       res.end("<h1>Sorry, not found.</h1>");
//     }
//   })
//   .listen(port);
// console.log(`Hey there AJ, the server has started and is listening on port number: ${port}`);

// =======================================================

// EXAMPLE 2
//===========

// const getViewUrl = (url) => { //Create a function to interpolate the URL into the file path.
//   return `views${url}.html`;
// };

// http
//   .createServer((req, res) => {
//     let viewUrl = getViewUrl(req.url); // Get the file-path string.
//     fs.readFile(viewUrl, (error, data) => { //Interpolate the request URL into your fs file search.
//       if (error) { // Handle errors with a 404 response code.
//         res.writeHead(httpStatus.StatusCodes.NOT_FOUND);
//         res.write("<h1>FILE NOT FOUND</h1>");
//       } else { //Respond with file contents.
//         res.writeHead(httpStatus.StatusCodes.OK, {
//           "Content-Type": "text/html",
//         });
//         res.write(data);
//       }
//       res.end();
//     });
//   })
//   .listen(port);
// console.log(`The server has started and is listening on port number: ${port}`);

// =======================================================

// EXAMPLE 3
//===========

const sendErrorResponse = (res) => { // Create an errorhandling function.
  res.writeHead(httpStatus.StatusCodes.NOT_FOUND, {
    "Content-Type": "text/html",
  });
  res.write("<h1>File Not Found!</h1>");
  res.end();
};

const customReadFile = (file_path, res) => { // Look for a file by the name requested.
  if (fs.existsSync(file_path)) { // Check whether the file exists.
    fs.readFile(file_path, (error, data) => { // if it exists, read it 
      if (error) { // send error message fs cannot read file, corupted file or something 
        console.log(error);
        sendErrorResponse(res);
        return;
      }
      res.write(data); // if can read, output
      res.end();
    });
  } else {
    sendErrorResponse(res); // if file is not here, error message
    console.error(error); // this will give us the actual error in the console log
  }
};

http
  .createServer((req, res) => {
    let url = req.url; // Store the request’s URL in a variable url.
    if (url.indexOf(".html") !== -1) { // Check the URL to see whether it contains a file extension. the index value of -1 then it means it does not exists, so it says "if this is valid then we can read"
      res.writeHead(httpStatus.StatusCodes.OK, {
        "Content-Type": "text/html", //Customize the response’s content type.
      }); 
      customReadFile(`./views${url}`, res); // Call readFile to read file contents.
    } else if (url.indexOf(".js") !== -1) {
      res.writeHead(httpStatus.StatusCodes.OK, {
        "Content-Type": "text/javascript",
      });
      customReadFile(`./public/js${url}`, res);
    } else if (url.indexOf(".css") !== -1) {
      res.writeHead(httpStatus.StatusCodes.OK, {
        "Content-Type": "text/css",
      });
      customReadFile(`./public/css${url}`, res);
    } else if (url.indexOf(".png") !== -1) {
      res.writeHead(httpStatus.StatusCodes.OK, {
        "Content-Type": "image/png",
      });
      customReadFile(`./public/images${url}`, res);
    } else {
      sendErrorResponse(res);
    }
  })
  .listen(port);

console.log(`The server is listening on port number: ${port}`);


