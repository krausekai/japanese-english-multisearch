/*
1. On app startup, find new releases via a github json file
2. If there is a new release, alert the user, and open the github release page via their web browser if they wish to update - they can manually update
*/
const localVersion = app.getVersion();
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
	const updaterPath = path.join('file://', __dirname, './updater.html')
	let win = new BrowserWindow({
		frame: true,
		width: 650,
		height: 230
	})
	win.on('close', function () { win = null })
	win.loadURL(updaterPath)
	win.show()
}