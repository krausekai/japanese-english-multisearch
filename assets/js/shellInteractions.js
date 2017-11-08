/*
All website links within the UI should be opened with a default program. Copora tables too.
Dictionary tables have special rules for search results and search field input.
*/

// Manage Shell interactions - https://github.com/electron/electron/blob/master/docs/api/shell.md
const {shell} = require('electron')

var doc = document;

//Disable evals for scripts
window.eval = global.eval = function() {
	throw new Error("window.eval() blocked");
}

//Disable drag drop events
doc.addEventListener('dragover', function (e) {e.preventDefault()});
doc.addEventListener('drop', function (e) {e.preventDefault()});

// pagination function setup
var page = window.location.href;
if (page.endsWith("index.html")) {
	//Assign an audio player (currently only for ldoce/longman dictionary)
	var globalAudio = doc.getElementById('globalAudioPlayer');
	function playAudio(e) {
		var e = window.e || e;
		var audioFile = e.target.getAttribute("data-src-mp3").toString();
		if (audioFile) {
			if (!audioFile.includes("ldoceonline.com")) {
				audioFile = "https://www.ldoceonline.com/" + audioFile;
			}
			globalAudio.src = audioFile;
			globalAudio.play();
		}
	}
	doc.addEventListener('click', playAudio, true);

	// Dictionary tab
	var tabOne = doc.getElementById("tabOne");
	tabOne.addEventListener('click', tabOneClickback, false);
	tabOne.addEventListener('auxclick', defaultClickback, false);
	// Corpora tab
	var tabTwo = doc.getElementById("tabTwo");
	tabTwo.addEventListener('click', defaultClickback, false);
	tabTwo.addEventListener('auxclick', defaultClickback, false);
} else {
	window.addEventListener('click', defaultClickback, false);
	window.addEventListener('auxclick', defaultClickback, false);
}

// for the page named "index.html"
function tabOneClickback(e) {
	var e = window.e || e;

	//return if right click
	if (e.which == 3) {
		return;
	}

	// if this is a clicked URL
	if (e.target.localName == 'a' || e.target.localName == 'A' || e.target.parentNode.nodeName == 'a' || e.target.parentNode.nodeName == 'A') {
		e.preventDefault();

		var url = e.target.parentNode.href || e.target.href;

		// Fix file:\\ paths
		var target = e.target || e.srcElement;
		var targetClass = target.className;

		// Do a top parent check to break look check
		while(target){
			if (targetClass == "ldoceDictOutput" || targetClass == "kotobankDict") {
				break;
			}
			target = target.parentNode;
			targetClass = target.className;
		}

		if (url.startsWith("file:")) {
			if (targetClass == "ldoceDictOutput" && url.includes("/dictionary/")) {
				var searchTerm = url.match("dictionary.*");
				url = "https://www.ldoceonline.com/" + searchTerm;
			}
			else if (targetClass == "kotobankDict" && url.includes("/word/")) {
				var searchTerm = url.match("word.*");
				url = "https://kotobank.jp/" + searchTerm;
			}
		}

		if (url.startsWith("http://ejje.weblio.jp/content/") || url.startsWith("https://ejje.weblio.jp/content/")) {
			weblioDictionary(url);
		}
		else if (url.startsWith("http://kotobank.jp/word/") || url.startsWith("https://kotobank.jp/word/")) {
			kotobankDictionary(url);
		}
		else if (url.startsWith("http://www.ldoceonline.com/dictionary/") || url.startsWith("https://www.ldoceonline.com/dictionary/") || url.startsWith("http://www.ldoceonline.com/search/direct/") ||  url.startsWith("https://www.ldoceonline.com/search/direct/")) {
			ldoceDictionary(url);
		}
		else {
			// Else, input the clicked URL text into the input box for searching
			var input = doc.getElementById("search").elements["searchbar"];
			input.value = e.target.innerText;
		}
	}
}

// Open other URLs with default programs and not Electron
function defaultClickback(e) {
	var e = window.e || e;

	//return if right click
	if (e.which == 3) {
		return;
	}

	if (e.target.localName == 'a' || e.target.localName == 'A' || e.target.parentNode.nodeName == 'a' || e.target.parentNode.nodeName == 'A') {
		e.preventDefault();
		shell.openExternal(e.target.href);
	}
}