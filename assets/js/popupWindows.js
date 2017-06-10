// For opening new windows or importing files
const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')

// Open a html file dialog window
function showWindow(file, options) {
	let filePath = path.join('file://', __dirname, file)
	options = options || {};
	
	let win = new BrowserWindow(options)
	win.on('close', function () { win = null })
	win.loadURL(filePath)
	win.show()
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------

function showAbout() {
	let file = './about.html';
	let options = {};
	
	showWindow(file, options);
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------

const localVersion = require('electron').remote.app.getVersion();
const remoteVersionUrl = 'https://raw.githubusercontent.com/krausekai/japanese-english-multisearch/master/package.json';
var remoteVersion = localStorage.getItem("remoteVersion");

function checkVersion() {
	let page = window.location.href;
	
	request(remoteVersionUrl, requestOptions, function (error, response, data) {
		if (!error && response.statusCode == 200) {
			data = JSON.parse(data);
			localStorage.setItem("remoteVersion", data.version);
			if (data.version > localVersion) {
				showUpdater();
			} else if (!page.endsWith("index.html")) {
				alert("No new updates");
			}
		} else {
			if (!page.endsWith("index.html")) {
				alert("Try again later");
			}
		}
	});
}

function showUpdater() {
	let file = './updater.html'
	let options = {frame: true, width: 650, height: 230};
	showWindow(file, options);
}