const mainnav = document.querySelector('.nav')
const hambutton = document.querySelector('#menu');

// Add a click event listender to the hamburger button and use a callback function that toggles the list element's list of classes.
hambutton.addEventListener('click', () => {
	mainnav.classList.toggle('show');
	hambutton.classList.toggle('show');
}); const visitsDisplay = document.querySelector("#visits");


const form = document.querySelector("#updateForm")
form.addEventListener("change", function () {
	const updateBtn = document.querySelector("button")
	updateBtn.removeAttribute("disabled")
})
