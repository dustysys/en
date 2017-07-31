/*#############################################################################
File: bg.js

This runs in the background and executes functions based on events such
as alarms, web requests by the user and notifications. It also is the first
script to run on install, so it will do initialization if necessary.
#############################################################################*/

// TODO: send popup messages about new updates so it can immediately show them to user
function sendMessage() {
}

/**
 * creates an alarm for updating releases with a frequency specified by user preferences
 */
function scheduleReleaseUpdates() {
	if (bg.prefs.release_update.enabled) {
		var alarm_name = "update_releases:" + bg.alarm_timestamp;
		chrome.alarms.create(alarm_name, { periodInMinutes: bg.prefs.release_update.interval });
	}
}

/**
 * creates an alarm for syncing uncaught list changes with a frequency specified by user preferences
 */
function scheduleSyncs() {
	if (bg.prefs.list_sync.enabled) {
		var alarm_name = "update_all:" + bg.alarm_timestamp;
		chrome.alarms.create(alarm_name, { periodInMinutes: bg.prefs.list_sync.interval });
	}
}

// listens for notification click events 
// on click creates a new tab using ID of notification as URL.
function listenNotifications() {
	if (bg.prefs.release_update.enabled) {
		chrome.notifications.onClicked.addListener(openNotificationLink);
	}
}

// updates the badge on startup
function listenStartup() {
	chrome.runtime.onStartup.addListener(function () {
		updateBadge();
	});
}

// listens for messages from other scripts
function listenMessages() {
	chrome.runtime.onMessage.addListener(checkMessage);
}

/**
 * loads stored user preferences pertinent to background script behavior
 * @param {function} callback
 */
function bgLoadPrefs(callback) {
	loadAllPrefs(function (prefs) {
		window.bg = new bgState(prefs, Date.now());
		bgApplyPrefs();
		if (callback) callback();
	});
}

/**
 * registers to events based on what is enabled by user preferences
 */
function bgApplyPrefs() {
	scheduleReleaseUpdates();
	scheduleSyncs();
	listenNotifications();
}

/**
 * clears old listeners in preparation for making new ones
 */
function clearOldPrefs() {
	chrome.alarms.clearAll();
	chrome.notifications.onClicked.removeListener(openNotificationLink);
}

/**
 * loads newly set preferences, usually because the user has changed them
 */
function bgUpdatePrefs() {
	clearOldPrefs();
	bgLoadPrefs();
}

class bgState {
	constructor(prefs, time) {
		this._alarm_timestamp = time;
		this._prefs = prefs;
	}

	get alarm_timestamp() {
		return this._alarm_timestamp;
	}

	set alarm_timestamp(time) {
		this._alarm_timestamp = time; 
	}

	get prefs() {
		return this._prefs;
	}

	set prefs(prefs) {
		this._prefs = prefs;
	}

	getPref(pref) {
		return this._prefs[pref];
	}
}

/**
 * runs on every extension load, initializes background script
 */
function bgInit() {
	bgLoadPrefs(function () {
		listenMUComm();
		listenStartup();
		listenMessages();
		chrome.runtime.onInstalled.addListener(bgNewInstall);
		chrome.alarms.onAlarm.addListener(checkAlarm);
	});
	
}