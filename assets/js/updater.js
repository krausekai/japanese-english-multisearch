// TODO: Update the program by downloading the changed app data (html, css, js) instead of needing to download a new compiled build

var updater = module.exports = {};

const request = require('request-promise');
const localVersion = require('electron').remote.app.getVersion();
const remoteVersionUrl = 'https://raw.githubusercontent.com/krausekai/japanese-english-multisearch/master/package.json';
const remoteVersion = localStorage.getItem("remoteVersion");

updater.checkVersion = async function () {
	request(remoteVersionUrl, function (error, response, body) {
		response = JSON.parse(body);
		localStorage.setItem("remoteVersion", response.version);
		if (response.version !== localVersion) {
			ipcRenderer.send('open-updater-window');
		}
	});
}