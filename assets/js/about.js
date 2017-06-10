function about() {
	const aboutPath = path.join('file://', __dirname, './about.html')
	let win = new BrowserWindow({ frame: true })
	win.on('close', function () { win = null })
	win.loadURL(aboutPath)
	win.show()
}