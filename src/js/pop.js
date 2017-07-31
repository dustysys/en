/*#############################################################################
File: pop.js

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
 * engages global listeners on startup
 */
function popupHookListeners() {
	document.addEventListener("click", function (event) {
		// saves last clicked element
		// currently used for shift-click select functionality
		pop.last_clicked_el = event.target;
	});
}

/**
 * checks if session is valid and if not, initiates a check to
 * see if it's at least valid for popup purposes and handles
 * problems if it isn't.
 * @param data
 */
function popupValidateSession(data) {
	sessionIsValid(function (valid_session) {
		if (valid_session && data !== "No Data") {
			// session is fine, popup is probably already loaded
		} else {
			popupHandleInvalidSession(data);
		}
	});
}

class PopState {
	constructor(prefs) {
		this._prefs = prefs
		this._block_transitions = false;
		this._last_clicked_el = null;
	}

	get last_clicked_el() {
		return this._last_clicked_el;
	}

	set last_clicked_el(el) {
		this._last_clicked_el = el;
	}

	get block_transitions() {
		return this._block_transitions;
	}

	set block_transitions(block) {
		this._block_transitions = block;
	}

	get prefs() {
		return this._prefs;
	}

	set prefs(prefs) {
		this._prefs = prefs;
	}

	setPref(pref, value) {
		this._prefs[pref] = value;
		saveAllPrefs(this._prefs);
	}

	getPref(pref) {
		return this._prefs[pref];
	}
}

/**
 * loads user preferences relevant to popup into global
 * @param {function} callback
 */
function popupLoadPrefs(callback) {
	loadAllPrefs(function (prefs) {
		window.pop = new PopState(prefs);
		popupApplyPrefs();
		callback();
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
			popupValidateSession(data);
		});
	});

	return;
}