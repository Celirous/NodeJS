const express = require('express');
const app = express();
const layouts = require("express-ejs-layouts");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");

app.set("view engine", "ejs");

app.set("port", process.env.PORT || 3000);

app.get('/', (req, res) => {
    res.render("index");
});

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(express.json());

app.use(layouts);

app.use(express.static("public"));

app.get("/courses", homeController.showCourses);
app.get("/contact", homeController.showSignUp);
app.post("/contact", homeController.postedSignUpForm);

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get('port'), () => {
    console.log(`Server running at hppt://localhost:${app.get('port')}`);
});


// SUMMARY OF CODE 
// ======================================
/**
 * CONFETTI CUISINE - EXPRESS.JS WEB APPLICATION
 * 
 * Overview:
 * This is a cooking course website built with Express.js and EJS templating.
 * The application allows users to browse cooking courses and submit contact forms
 * to express interest in learning more.
 * 
 * Architecture:
 * - MVC Pattern: Uses controllers (homeController, errorController) to separate
 *   business logic from routing
 * - View Engine: EJS with express-ejs-layouts for consistent page structure
 * - Static Assets: Served from /public directory (CSS, images)
 * 
 * Routes:
 * - GET  /           : Homepage with welcome message
 * - GET  /courses    : Display list of available cooking courses
 * - GET  /contact    : Show contact/signup form
 * - POST /contact    : Handle form submission
 * - Error handlers   : 404 and 500 error pages
 * 
 * Key Features:
 * - Bootstrap-styled responsive layout
 * - Shared navigation across all pages via layout.ejs
 * - Form handling with URL-encoded and JSON body parsing
 * - Centralized error handling
 * 
 * Note: There's a typo in the console.log - "hppt" should be "http"
 * 
 * Dependencies:
 * - express: Web framework
 * - ejs: Templating engine
 * - express-ejs-layouts: Layout support for EJS
 */