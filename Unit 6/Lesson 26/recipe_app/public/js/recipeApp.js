$(document).ready(() => { //the $(document) is shorthand for the jquery
  $("#modal-button").click(() => { // once the button received a click event it will active
    $(".modal-body").html(""); // this will clear it out for you so that it is blank, due to outdated info
    $.get("/courses?format=json", data => { //this will grab info from the courses we have
      data.forEach(course => { // this will now use a for loop to output into this blank modal so that it can always be up to date
        $(".modal-body").append( //we are appending each course on to the modal body
          `<div>
						<span class="course-title">
							${course.title}
						</span>
						<div class="course-description">
							${course.description}
						</div>
					</div>`
        );
      });
    });
  });
});
