/*#############################################################################
File: popup.js

This is the initializer script for when the extension popup is loaded. It
also contains the functions for communicating with the background script.
#############################################################################*/

var global_last_clicked_el;
var global_block_transitions = false;
var global_pref_scrollbar = { enabled: false };
var global_pref_animations = { enabled: true }; 
var global_pref_one_click_uptodate = { enabled: true };
var global_pref_release_update = { enabled: true, interval: 15 };
var global_pref_list_sync = { enabled: true, interval: 60 };
var global_pref_notifications = { enabled: true };

/**
 * sends a message to the background script letting it know
 * user preferences have changed.
 */
function popupSendBgPrefUpdate() {
	var message = {
		src: "en_popup",
		title: "UPDATED_PREFERENCE"
	};

	chrome.runtime.sendMessage(message, function (response) {
		console.log(response.title);
	});
}

/**
 * sends a message to background script asking it to update
 * the badge text
 */
function popupSendBgBadgeUpdateRequest() {
	var message = {
		src: "en_popup",
		title: "REQ_UPDATE_BADGE"
	};

	chrome.runtime.sendMessage(message, function (response) {
		console.log(response.title);
	});
}

/**
 * runs any necessary functions to handle preference changes
 */
function popupUpdatePrefs() {
	popupApplyPrefs();
	popupSendBgPrefUpdate();
}

/**
 * loads user preferences relevant to popup into global
 * @param {function} callback
 */
function popupLoadPrefs(callback) {
	loadAllPrefs(function (prefs) {
		global_pref_scrollbar = prefs["scrollbar"];
		global_pref_animations = prefs["animations"];
		global_pref_one_click_uptodate = prefs["one_click_uptodate"];
		global_pref_release_update = prefs["release_update"];
		global_pref_list_sync = prefs["list_sync"];
		global_pref_notifications = prefs["notifications"];

		popupApplyPrefs();
		callback();
	});
}

/**
 * engages global listeners on startup
 */
function popupHookListeners() {
	document.addEventListener("click", function (event) {
		// saves last clicked element
		// currently used for shift-click select functionality
		global_last_clicked_el = event.target;
	});
}

/**
 * initialization that runs on popup startup
 * defers session validation to async while popup loads
 * to give general case user quicker startup
 */
function popupInit() {
	popupLoadPrefs(function () {
		loadData(function (data) {

			if (data === "No Data") {
				console.log("No data to display.");

			} else {
				buildPopup(data);
			}
			popupHookListeners();
			validateSession(data);
		});
	});
	
	return;
}

// startup data load, popup building and session validation once DOM loads
document.addEventListener('DOMContentLoaded', popupInit);
