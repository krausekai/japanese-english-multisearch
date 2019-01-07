var searchHistory = module.exports = {};
var doc = document;
var searchHistoryMenu;
var searchTerms = [];

searchHistory.onload = function () {
	//Find searchHistoryMenu
	searchHistoryMenu = doc.getElementById("search").elements["searchHistoryMenu"];
	searchHistoryMenu.addEventListener("click", searchHistory.jump, false);
}

searchHistory.add = function (searchTerm) {
	if (searchTerm == "") return;
	//Check for duplicates
	for (var i = 0; i < searchTerms.length; ++i) {
		if (searchTerm == searchTerms[i]) {
			//Match the searchHistoryItem to the same as the searchTerm, if it already exists
			searchHistoryMenu.selectedIndex = i.toString();
			return;
		}
	}
	//Add the search term to the history, but limit the displayed search term to a substr for UI
	var maxLen = 10;
	//if (text_type.japanese.test(searchTerm) || !text_type.english.test(searchTerm)) maxLen = 8; // 8 length for Japanese and other languages
	//else if (text_type.english.test(searchTerm)) maxLen = 16; // 16 length for English
	if (searchTerm.length > maxLen) searchHistoryMenu.innerHTML += '<option value="' + searchTerm + '" selected>' + searchTerm.substr(0,maxLen) + '...</option>';
	else searchHistoryMenu.innerHTML += '<option value="' + searchTerm + '" selected>' + searchTerm + '</option>';
	searchTerms.push(searchTerm);
}

searchHistory.jump = function () {
	//Get the search term and searchHistory item
	var searchTerm = document.getElementById("search").elements["searchbar"].value;
	var searchHistoryItem = searchHistoryMenu.value;
	if (searchTerm == "" || searchTerm == searchHistoryItem) return;
	//Redo the search
	document.getElementById("search").elements["searchbar"].value = searchHistoryItem;
	document.getElementById("search").elements["searchbutton"].click();
}
