var popupsWindows = module.exports = {};

// For opening new windows or importing files
var BrowserWindow = require('electron').remote.BrowserWindow
var path = require('path')

// Open a html file dialog window
popupsWindows.new = function (file, options) {
	let filePath = path.join('file://', __dirname, file)
	options = options || {};
	
	let win = new BrowserWindow(options)
	win.on('close', function () { win = null })
	win.loadURL(filePath)
	win.show()
}