var updater = module.exports = {};

var https = require("https");
var {shell} = require("electron");
var app = require("electron").remote.app

var localVersion = require('electron').remote.app.getVersion();
var remoteVersionUrl = 'https://raw.githubusercontent.com/krausekai/japanese-english-multisearch/master/package.json';
var remoteVersion = localStorage.getItem("remoteVersion");
var updateUrl = "https://github.com/krausekai/japanese-english-multisearch/releases/latest";

async function getRemoteUrl(url) {
	return https.get(url, (resp) => {
		let data = "";

		resp.on("data", (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			data = JSON.parse(data);
			console.log(data)
		});

		return data;
	});
}

updater.checkVersion = async function () {
	var response = await getRemoteUrl(remoteVersionUrl);
	localStorage.setItem("remoteVersion", response.version);

	if (response.version !== localVersion) {
		var confirmation = confirm("New Update Available! Go to update page?");
		if (confirmation == true) {
			shell.openExternal(updateUrl);
			setTimeout(function() {
				app.quit();
			}, 1000)
		}
	}
}

updater.onload = function () {
	updater.checkVersion();
}
