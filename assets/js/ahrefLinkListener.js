/*
All website links within the UI should be opened with a default program. Copora tables too.
Dictionary tables have special rules for search results and search field input.
*/

// pagination check
var page = window.location.href;
if (page.endsWith("index.html")) {
	index();
} else {
	window.addEventListener('click', defaultClickback, false);
}

// for the page named "index.html"
function index () {
	//Audio (currently only for ldoce/longman dictionary)
	var globalAudio = document.getElementById('globalAudioPlayer');
	function playAudio(e) {
		var e = window.e || e;
		var audioFile = e.target.getAttribute("data-src-mp3");
		if (audioFile) {
			globalAudio.src = audioFile;
			globalAudio.play();
		}
	}
	document.addEventListener('click', playAudio, true);
	
	// Input clicked URL's inner text as a term from the tabOne (dictionary) div into the search bar
	function tabOneClickback(e) {
		var e = window.e || e;
		// if this is a clicked URL
		if (e.target.localName == 'a' || e.target.localName == 'A' || e.target.parentNode.nodeName == 'a' || e.target.parentNode.nodeName == 'A') {
			// Prevent opening the URL
			e.preventDefault();
			// For the Longman dictionary results, if this is a search page, search the embedded URL
			var url = e.target.parentNode.href || e.target.href;
			if (url.startsWith("http://ejje.weblio.jp/content/")) {
				weblioDictionary(url);
				return;
			}
			if (url.startsWith("https://kotobank.jp/word/")) {
				kotobankDictionary(url);
				return;
			}
			if (url.startsWith("http://www.ldoceonline.com/dictionary/") || url.startsWith("http://www.ldoceonline.com/search/direct/")) {
				ldoceDictionary(url);
				return;
			}
			// Else, open default
			//defaultClickback(e);
			// Else, input the clicked URL text into the input box for searching
			var input = document.getElementById("webscrapeform").elements["webscrapeformterm"];
			input.value = e.target.innerText;
		}
	}
	// Dictionary tab
	var tabOne = document.getElementById("tabOne");
	tabOne.addEventListener('click', tabOneClickback, false);
	// Corpora tab
	var tabTwo = document.getElementById("tabTwo");
	tabTwo.addEventListener('click', defaultClickback, false);
}

// Open other URLs with default programs and not Electron
function defaultClickback(e) {
	var e = window.e || e;
	if (e.target.localName == 'a' || e.target.localName == 'A' || e.target.parentNode.nodeName == 'a' || e.target.parentNode.nodeName == 'A') {
		e.preventDefault();
		shell.openExternal(e.target.href);
	}
}