// For opening new windows or importing files
var BrowserWindow = require('electron').remote.BrowserWindow
var path = require('path')
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

// For http requests - //https://github.com/request/request
var request = require('request');
var requestOptions = {headers: {'User-Agent': "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"}};

var localVersion = require('electron').remote.app.getVersion();
var remoteVersionUrl = 'https://raw.githubusercontent.com/krausekai/japanese-english-multisearch/master/package.json';
var remoteVersion = localStorage.getItem("remoteVersion");

function checkVersion() {
	request(remoteVersionUrl, requestOptions, function (error, response, data) {
		if (!error && response.statusCode == 200) {
			data = JSON.parse(data);
			localStorage.setItem("remoteVersion", data.version);
			if (data.version > localVersion) {
				showUpdater();
			}
		}
	});
}

function showUpdater() {
	let file = './updater.html'
	let options = {frame: true, width: 650, height: 230};
	showWindow(file, options);
}