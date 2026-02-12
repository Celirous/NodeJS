$(document).ready(() => { //the $(document) is shorthand for the jquery
  $("#modal-button").click(() => { // once the button received a click event it will active
    $(".modal-body").html(""); // this will clear it out for you so that it is blank, due to outdated info
    $.get(`/api/courses`, (results = {}) => {
      let data = results.data;
      if (!data || !data.courses) return;
      data.courses.forEach(course => { // this will now use a for loop to output into this blank modal so that it can always be up to date
        $(".modal-body").append( //we are appending each course on to the modal body
          `<div>
						<span class="course-title">
							${course.title}
						</span>
						<span class="course-cost">$${course.cost}</span>
						<button class="${course.joined ? "joined-button" : "join-button"} btn btn-info btn-sm" data-id="${course._id}">
							${course.joined ? "Joined" : "Join"}
						</button>
						<div class="course-description">
							${course.description}
						</div>
					</div>`
        );
      });
    }).then(() => {
      addJoinButtonListener(); // Call addJoinButtonListener function to add an event listener on your buttons after the AJAX request completes.
    });
  });
});

let addJoinButtonListener = () => {
  $(".join-button").click(event => { //Create the event listener for the modal button.
    let $button = $(event.target), // this will store the click event in the $button var
      courseId = $button.data("id"); // this will take the element that you clicked on (the course id) and save it in the courseId var
			console.log(`/api/courses/${courseId}/join`) // this will now make a get request to the course using the id, then we make an empty object called results and save it in there
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      let data = results.data;
      if (data && data.success) { //if we find data in the id we called, it runs this, when we run it, it changes the info on the join button itself
        $button
          .text("Joined")
          .addClass("joined-button")
          .removeClass("join-button");
      } else {
        $button.text("Try again"); // if it doesnt work succesfully, it will give you text to try again. 
      }
    });
  });
};


// Code Summary

// This jQuery script handles displaying available courses in a modal and allowing users to join them.

// When the page loads
// The code runs inside $(document).ready(), ensuring the DOM is fully loaded before attaching event listeners.
// When the modal button is clicked
// Clicking #modal-button:
// Clears the .modal-body content.
// Sends a GET request to /api/courses to retrieve course data.
// Checks if the response contains valid course data.
// Iterates through data.courses and dynamically appends HTML for each course to .modal-body.

// Each course entry includes:
// Course title
// Course cost

// A button:
// Displays "Join" if the user hasn’t joined.
// Displays "Joined" if already joined.
// Uses conditional classes (join-button or joined-button).
// Course description
// After the courses are added to the DOM, addJoinButtonListener() is called.
// Handling the "Join" button
// addJoinButtonListener():
// Attaches a click event listener to all elements with class .join-button.

// When clicked:
// Retrieves the course ID from the button’s data-id.
// Sends a GET request to /api/courses/{courseId}/join.
// If the response indicates success:
// Changes button text to "Joined"
// Replaces class join-button with joined-button

// If unsuccessful:
// Changes button text to "Try again"
// Overall Functionality

// This script:
// Dynamically loads courses into a modal from an API.
// Allows users to join courses via another API request.
// Updates the UI in real time to reflect join status.
// Uses jQuery for DOM manipulation and AJAX requests.

// In short:
// It creates a simple interactive course enrollment system inside a modal window.