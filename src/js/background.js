/*#############################################################################
File: background.js

This runs in the background and executes functions based on events such
as alarms, web requests by the user and notifications. It also is the first
script to run on install, so it will do initialization if necessary.
#############################################################################*/

var global_alarm_timestamp = Date.now();
var global_pref_release_update = { enabled: true, interval: 15 };
var global_pref_list_sync = { enabled: true, interval: 60 };
var global_pref_notifications = { enabled: true };



// TODO: send popup messages about new updates so it can immediately show them to user
function sendMessage() {
}

/**
 * creates an alarm for updating releases with a frequency specified by user preferences
 */
function scheduleReleaseUpdates() {
	if (global_pref_release_update.enabled) {
		var alarm_name = "update_releases:" + global_alarm_timestamp;
		chrome.alarms.create(alarm_name, { periodInMinutes: global_pref_release_update.interval });
	}
}

/**
 * creates an alarm for syncing uncaught list changes with a frequency specified by user preferences
 */
function scheduleSyncs() {
	if (global_pref_list_sync.enabled) {
		var alarm_name = "update_all:" + global_alarm_timestamp;
		chrome.alarms.create(alarm_name, { periodInMinutes: global_pref_list_sync.interval });
	}
}

// listens for notification click events 
// on click creates a new tab using ID of notification as URL.
function listenNotifications() {
	if (global_pref_release_update.enabled) {
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
		global_pref_release_update = prefs["release_update"];
		global_pref_list_sync = prefs["list_sync"];
		global_pref_notifications = prefs["notifications"];
		callback();
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
	global_alarm_timestamp = Date.now();
}

/**
 * loads newly set preferences, usually because the user has changed them
 */
function bgUpdatePrefs() {
	clearOldPrefs();
	bgLoadPrefs(function () {
		bgApplyPrefs();
	});
}

/**
 * runs on every extension load, initializes background script
 */
function bgInit() {
	listenMUComm();
	listenStartup();
	listenMessages();
	chrome.runtime.onInstalled.addListener(bgNewInstall);
	chrome.alarms.onAlarm.addListener(checkAlarm);
	bgLoadPrefs(function () {
		bgApplyPrefs();
	});
}

bgInit();