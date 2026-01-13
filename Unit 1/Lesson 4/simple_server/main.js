//first line of code assigns the port number you’ll use for this application: 3000. This is where the app will be accesable from. 
const port = 3000; 
    // Then you use require to import a specific Node.js module called http and save it as a constant.
    const http = require("http"); 
    // You also require the http-status-codes package to provide constants representing HTTP status codes.
    const httpStatus = require("http-status-codes");
    // Next, you use the http variable as a reference to the HTTP module to create a server, using that module’s createServer function, and store the resulting server in a variable called app. THis is now everything the app can do 
    const app = http.createServer((request, response) => {
        // You log that a request was received from the client
        console.log("Received an incoming request!");
        // The first line uses a writeHead method to define some basic properties of the response’s HTTP header. In this case, you’re returning httpStatus.OK, which represents a 200 response code, and an HTML content-type to indicate that the server received a request successfully and will return content in the form of HTML
        response.writeHead(httpStatus.StatusCodes.OK, {
            "Content-Type": "text/html" // we are telling it that the files we are sending through are in an HTML format 
        });

        // Following this block, you assign a local variable, responseMessage, with your response message in HTML.
        let responseMessage = "<h1>Hello, Universe!</h1>";
        // Right below that line, you’re writing a line of HTML in the response with write and closing the response with end.
        // You must end your response with end to tell the server that you’re no longer writing content.
        response.write(responseMessage);
        response.end();
        // You also log your response at this point so you can see that a response was sent from the server itself. We want to see what the response is so that we can debug in the console log as we need. 
        console.log(`Sent a response : ${responseMessage}`);
    });

    //The last line of code takes the server instance, app, and runs the listen method to indicate that the server is ready for incoming requests at port 3000.
app.listen(port);
console.log(`The server has started and is listening on port number: ${port}`);