var updater = module.exports = {};

var popupWindows = require("./js/popupWindows.js");
var request = require('request');
var requestOptions = {headers: {'User-Agent': "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"}};
var localVersion = require('electron').remote.app.getVersion();
var remoteVersionUrl = 'https://raw.githubusercontent.com/krausekai/japanese-english-multisearch/master/package.json';
var remoteVersion = localStorage.getItem("remoteVersion");

updater.checkVersion = function () {
	request(remoteVersionUrl, requestOptions, function (error, response, data) {
		if (!error && response.statusCode == 200) {
			data = JSON.parse(data);
			localStorage.setItem("remoteVersion", data.version);
			if (data.version !== localVersion) {
				updater.showUpdater();
			}
		}
	});
}

updater.showUpdater = function () {
	let file = '/../updater.html'
	let options = {frame: true, width: 650, height: 240};
	popupWindows.new(file, options);
}