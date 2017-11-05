var about = module.exports = {};

var popupWindows = require("./js/popupWindows.js");

about.onload = function () {
	var searchformbutton = doc.getElementById("search").elements["aboutbutton"];
	searchformbutton.addEventListener("click", about.showAbout, false);
}

about.showAbout = function () {
	let file = '/../about.html';
	let options = {};
	popupWindows.new(file, options);
}