var updater = module.exports = {};

var localVersion = require('electron').remote.app.getVersion();
var remoteVersionUrl = 'https://raw.githubusercontent.com/krausekai/japanese-english-multisearch/master/package.json';
var remoteVersion = localStorage.getItem("remoteVersion");

updater.checkVersion = async function () {
	var response = await getRequest(remoteVersionUrl);

	response = JSON.parse(response);
	localStorage.setItem("remoteVersion", response.version);
	if (response.version !== localVersion) {
		ipcRenderer.send('open-updater-window');
	}
}