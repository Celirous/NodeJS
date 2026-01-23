exports.respondWithName = (req, res) => {
  let paramsName = req.params.myName; //Assign a local variable to a request 
  res.render("index", { name: paramsName }); //Pass a local variable to a rendered view.
};
