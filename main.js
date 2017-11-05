// Modules required from electron
const {app, BrowserWindow} = require('electron')

const path = require('path')
const url = require('url')

// Keep a global reference of the window object to prevent the window closing when JavaScript object is garbage collected.
let mainWindow

// Right-click context menu - https://github.com/sindresorhus/electron-context-menu
require('electron-context-menu')({});

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 756
	})

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, './assets/index.html'),
		protocol: 'file:',
		slashes: true
	}))

	//mainWindow.webContents.openDevTools()

	//Hide the default menubar
	mainWindow.setMenu(null);

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		app.quit();
	})
}

// Create window after initialization. Some APIs can only be used after this event.
app.on('ready', createWindow)

app.on('browser-window-created', function(e,window) {
	//Hide each newly created window's menu
	window.setMenu(null);
});

app.on('activate', function() {
	// On OS X it's common to re-create a window in the app\ when the dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// Quit properly on OS X
	if (process.platform !== 'darwin') {
		app.quit()
	}
})