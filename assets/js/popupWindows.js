var ipcRenderer = require("electron").ipcRenderer;

var popupsWindows = module.exports = {};
var updater = require("./js/updater.js");

// Event listener for the about button
var searchformbutton = doc.getElementById("search").elements["aboutbutton"];
searchformbutton.addEventListener("click", aboutWindow, false);

async function aboutWindow() {
	ipcRenderer.send('open-about-window');
}

// Check for new versions
updater.checkVersion();