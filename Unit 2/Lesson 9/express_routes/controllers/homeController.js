exports.sendReqParams = (req, res) => {
  //this vegetable can be any value, it is not hard coded
  let veg = req.params.vegetable; //this saves the vegetable we chose into a var veg
  console.log("Params :", req.params); // this shows us the paramater (vegetable) we are requesting on the console
  res.send(`This is the page for ${veg}`); // this outputs the param we chose on the website
};

exports.sendPostReq = (req, res) => {
  console.log("Request Body: ", req.body);
  console.log("Request Query: ", req.query);
  res.send("POST Successful!");
};
