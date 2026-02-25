const mongoose = require("mongoose");
const db = require("./models");

const createTutorial = function (tutorial) {
  return db.Tutorial.create(tutorial).then((docTutorial) => {
    console.log("\n>> Created Tutorial:\n", docTutorial);
    return docTutorial;
  });
};

// const createImage = function (tutorialId, image) {
//   console.log("\n>> Add Image:\n", image);
//   return db.Tutorial.findByIdAndUpdate(
//     tutorialId,
//     {
//       $push: {
//         images: {
//           url: image.url,
//           caption: image.caption,
//         },
//       },
//     },
//     { new: true, useFindAndModify: false },
//   );
// };

// const createComment = function(tutorialId, comment) {
//   return db.Comment.create(comment).then(docComment => {
//     console.log("\n>> Created Comment:\n", docComment);
//     return db.Tutorial.findByIdAndUpdate(
//       tutorialId,
//       { $push: { comments: docComment._id } },
//       { new: true, useFindAndModify: false }
//     );
//   });
// };

// const getTutorialWithPopulate = function(id) {
//   return db.Tutorial.findById(id).populate("comments", "-_id -__v");
// };

const createCategory = function(category) {
  return db.Category.create(category).then(docCategory => {
    console.log("\n>> Created Category:\n", docCategory);
    return docCategory;
  });
};

const addTutorialToCategory = function(tutorialId, categoryId) {
  return db.Tutorial.findByIdAndUpdate(
    tutorialId,
    { category: categoryId },
    { new: true, useFindAndModify: false }
  );
};

const getTutorialsInCategory = function(categoryId) {
  return db.Tutorial.find({ category: categoryId })
    .populate("category", "name -_id")
    .select("-comments -images -__v");
};

const run = async function() {
  var tutorial = await createTutorial({
    title: "Tutorial #1",
    author: "bezkoder"
  });

  var category = await createCategory({
    name: "Node.js",
    description: "Node.js tutorial"
  });

  await addTutorialToCategory(tutorial._id, category._id);

  var newTutorial = await createTutorial({
    title: "Tutorial #2",
    author: "bezkoder"
  });

  await addTutorialToCategory(newTutorial._id, category._id);

  var tutorials = await getTutorialsInCategory(category._id);
  console.log("\n>> all Tutorials in Cagetory:\n", tutorials);
};


mongoose.connect("mongodb://127.0.0.1:27017/oneToMany");

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

run();