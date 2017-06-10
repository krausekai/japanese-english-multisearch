//Disable evals for scripts
window.eval = global.eval = function() {
	throw new Error("Sorry, we do not support window.eval() for security reasons.");
}

//Disable drag drop events
document.addEventListener('dragover', function (e) {e.preventDefault()});
document.addEventListener('drop', function (e) {e.preventDefault()});