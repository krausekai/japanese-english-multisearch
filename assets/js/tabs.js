function changeTab(evt, tabName) {
	// Declare all variables
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks", and remove or add the 'active' class to them as necessary (and check for duplicates with indexOf)
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		var child = tablinks[i].children[0];
		if (!child.checked && tablinks[i].className.indexOf(" active") >= 0) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		} else if (child.checked && tablinks[i].className.indexOf(" active") <= 0) {
			tablinks[i].className += " active";
		}
	}

	// Show the current tab
	document.getElementById(tabName).style.display = "block";
}