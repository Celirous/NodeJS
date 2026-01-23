const httpStatus = require("http-status-codes");


exports.logErrors = (error, req, res, next) => {
  // the next here will now look for the next error and go through them till it can find the error we need.
  console.error(error.stack); // Log the error stack. this is the same as console.log but it will only show the error type of log
  next(error); // Pass the error to the next middleware function. We dont deal with the error, we just pass it along
};

exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.StatusCodes.NOT_FOUND;
  res.status(errorCode);
//   res.send(`${errorCode} | The page does not exist!`);
  res.sendFile(`./public/${errorCode}.html`, { root: "./"})
};
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
  console.log(`ERROR occurred: ${error.stack}`);
  res.status(errorCode);
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`);
  
};
