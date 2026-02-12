$(document).ready(() => { //the $(document) is shorthand for the jquery
  $("#modal-button").click(async () => { // once the button received a click event it will active
    $(".modal-body").html("");  // this will clear it out for you so that it is blank, due to outdated info
    
    try {
      const results = await $.get("/api/courses?apiToken=recipeT0k3n/$");
      const data = results.data;
      
      if (!data || !data.courses) return;
      
      data.courses.forEach(course => { // this will now use a for loop to output into this blank modal so that it can always be up to date
        $(".modal-body").append( //we are appending each course on to the modal body
          `<div>
            <span class="course-title">
              ${course.title}
            </span>
            <button class='button ${course.joined ? "joined-button" : "join-button"}' data-id="${course._id}">
              ${course.joined ? "Joined" : "Join"}
            </button>
            <div class="course-description">
              ${course.description}
            </div>
          </div>`
        );
      });
      
      addJoinButtonListener(); // Call addJoinButtonListener function to add an event listener on your buttons after the AJAX request completes.
      
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  });
});


let addJoinButtonListener = () => {
  $(".join-button").click(event => { //Create the event listener for the modal button.
    let $button = $(event.target), // this will store the click event in the $button vat 
      courseId = $button.data("id"); // this will take the element that you clicked on (the course id) and save it in the courseId var
    $.get(`/api/courses/${courseId}/join`, (results = {}) => { // this will now make a get request to the course using the id, then we make an empty object called results and save it in there 
      let data = results.data; 
      if (data && data.success) { //if we find data in the id we called, it runs this, when we run it, it changes the info on the join button itself
        $button
          .text("Joined")
          .addClass("joined-button")
          .removeClass("join-button");
      } else {
        $button.text("Login First/Already added (recipeApp.js)"); // if it doesnt work succesfully, it will give you text to try again. 
      }
    });
  });
};


// $(document).ready(() => { //the $(document) is shorthand for the jquery
//   $("#modal-button").click(() => {  // once the button received a click event it will active
//     $(".modal-body").html(""); // this will clear it out for you so that it is blank, due to outdated info
//     $.get("/api/courses", (results = {}) => { //this will grab info from the courses we have
//       let data = results.data;
//       if (!data || !data.courses) return;
//       data.courses.forEach(course => { // this will now use a for loop to output into this blank modal so that it can always be up to date
//         $(".modal-body").append( //we are appending each course on to the modal body
//           `<div>
// 						<span class="course-title">
// 							${course.title}
// 						</span>
// 						<button class='button ${course.joined ? "joined-button" : "join-button"}' data-id="${course._id}">
// 							${course.joined ? "Joined" : "Join"}
// 						</button>
// 						<div class="course-description">
// 							${course.description}
// 						</div>
// 					</div>`
//         );
//       });
//     }).then(() => {
//       addJoinButtonListener();
//     });
//   });
// });

// let addJoinButtonListener = () => {
//   $(".join-button").click(event => {
//     let $button = $(event.target),
//       courseId = $button.data("id");
//     $.get(`/api/courses/${courseId}/join`, (results = {}) => {
//       let data = results.data;
//       if (data && data.success) {
//         $button
//           .text("Joined")
//           .addClass("joined-button")
//           .removeClass("join-button");
//       } else {
//         $button.text("Try again");
//       }
//     });
//   });
// };
