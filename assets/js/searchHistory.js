var searchHistory = module.exports = {};
var doc = document;
var searchHistoryMenu;
var searchTerms = [];

searchHistory.onload = function () {
	//Find searchHistoryMenu
	searchHistoryMenu = doc.getElementById("search").elements["searchHistoryMenu"];
	searchHistoryMenu.addEventListener("click", searchHistory.jump, false);
	
	//Add searchTerms
	var searchform = doc.getElementById("freeSearchForm");
	searchform.addEventListener("submit", searchHistory.add, false);
	var searchformbutton = doc.getElementById("search").elements["searchbutton"];
	searchformbutton.addEventListener("click", searchHistory.add, false);
}

searchHistory.add = function () {
	//Get the search term
	var searchTerm = doc.getElementById("search").elements["searchbar"].value;
	if (searchTerm == '') {
		return
	}
	//Check for duplicates
	for (var i = 0; i < searchTerms.length; ++i) {
		if (searchTerm == searchTerms[i]) {
			//Match the searchHistoryItem to the same as the searchTerm, if it already exists
			searchHistoryMenu.selectedIndex = i.toString();
			return;
		}
	}
	//Add the search term
	searchHistoryMenu.innerHTML += '<option value="' + searchTerm + '" selected>' + searchTerm + '</option>';
	searchTerms.push(searchTerm);
}

searchHistory.jump = function () {
	//Get the search term and searchHistory item
	var searchTerm = doc.getElementById("search").elements["searchbar"].value;
	var searchHistoryItem = searchHistoryMenu.value;
	if (searchTerm == '' || searchTerm == searchHistoryItem) {
		return
	}
	//Redo the search
	doc.getElementById("search").elements["searchbar"].value = searchHistoryItem;
	doc.getElementById("search").elements["searchbutton"].click();
}
