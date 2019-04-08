var tabs = module.exports = {};
var doc = document;

var pageTabs = [];

tabs.onload = async function () {
	//Resize GUI
	var tableResize = async function () {
		var tabOne = document.getElementsByClassName("tbodySize")[0];
		var tabTwo = document.getElementsByClassName("tbodySize")[1];
		// Make sure to minus the header height below
		tabOne.style.height = window.innerHeight - 97 + "px";
		tabTwo.style.height = window.innerHeight - 153 + "px";
	}
	tableResize();
	window.addEventListener("resize", tableResize, false);

	// get all tabs
	pageTabs = document.getElementsByClassName("tablinks");

	// change to the main tab
	pageTabs[0].click();

	// monitor key events to change tab
	window.addEventListener("keydown", function (e) {
		var evtobj = window.event? event : e;

		var tabKey = 9;

		// re-cache currently active tab
		pageTabs = document.getElementsByClassName("tablinks");

		// get current tab
		var currentTabIndex;
		for (var i = 0; i < pageTabs.length; i++) {
			if (pageTabs[i].classList.contains("active")) {
				currentTabIndex = i;
				break;
			}
		}

		// tab back
		if (evtobj.ctrlKey && evtobj.shiftKey && evtobj.keyCode == tabKey) {
			if (currentTabIndex-1 > -1) return pageTabs[currentTabIndex-1].click();
		}

		// tab forward
		if (evtobj.ctrlKey && !evtobj.shiftKey && evtobj.keyCode == tabKey) {
			if (currentTabIndex+1 < pageTabs.length) return pageTabs[currentTabIndex+1].click();
		}
	}, true);
}

tabs.changeTab = async function (evt, tabName) {
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = doc.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks", and remove or add the 'active' class to them as necessary (and check for duplicates with indexOf)
	tablinks = doc.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		var child = tablinks[i].children[0];
		if (!child.checked && tablinks[i].className.indexOf(" active") >= 0) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		} else if (child.checked && tablinks[i].className.indexOf(" active") <= 0) {
			tablinks[i].className += " active";
		}
	}

	// Show the current tab
	doc.getElementById(tabName).style.display = "block";
}