// All input focuses the desired id (and element) with keycode (event) checking.
var inputFocus = module.exports = {};

var doc = document;
var previousKeyCode;

inputFocus.onload = function () {
	window.addEventListener("keydown", function () {
		inputFocus.focus(event, "search", "searchbar");
	}, true)
}

inputFocus.focus = function (event, id, element) {
	var keycode = event.which || event.keycode;
	//Prevent the up and down arrow keys from focusing the input
	var upArrowKey = 38;
	var downArrowKey = 40;
	if (keycode == upArrowKey || keycode == downArrowKey) {
		return;
	}
	//Prevent the ctrl+c keycode from focusing the input
	var ctrlKey = 17;
	var cmdKey = 91;
	var cKey = 67;
	if (keycode == ctrlKey || keycode == cmdKey) {
		previousKeyCode = keycode;
		return;
	} else if (previousKeyCode == ctrlKey || previousKeyCode == cmdKey) {
		if (keycode == cKey) {
			previousKeyCode = keycode;
			return;
		}
	} else {
		previousKeyCode = keycode;
	}
	
	if (id && element) {
		var input = doc.getElementById(id).elements[element];
	} else if (id && !element) {
		var input = doc.getElementById(id);
	} else {
		return console.error("error: no input ID assigned");
	}
	
	input.focus();
}