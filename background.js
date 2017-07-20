/*#############################################################################
File: background.js

This runs in the background and executes functions based on events such
as alarms, web requests by the user and notifications. It also is the first
script to run, so it will do initialization if necessary.
#############################################################################*/

var global_alarm_timestamp = Date.now();
var global_pref_release_update = { enabled: true, interval: 15 };
var global_pref_list_sync = { enabled: true, interval: 60 };
var global_pref_notifications = { enabled: true };


// TODO: clean up this unnecessary callback spaghetti
function bgSync() {
	pullUserSessionInfo(function (current_user_id, logged_in_user_id) {
		isFirstSession(function (first_session) {
			if (first_session) {
				if (logged_in_user_id && logged_in_user_id !== "No User") {
					initializeNewSession(logged_in_user_id, function () {
						finishFirstSession(function () {
							console.log("New session initialized from background script");
							updateBadge();
						});
					});
				}
			} else {
				pullAllData();
				updateBadge();
			}
		});
	});
}

function bgUpdateReleases() {
	updateLists();
}

/**
 * check an alarm event for its purpose and execute based on it
 * @param {Event} alarm
 */
function checkAlarm(alarm) {
	if (alarm && alarm.name) {
		var alarm_desc = alarm.name.substring(0, alarm.name.indexOf(":"));
		var alarm_id = alarm.name.substring(alarm.name.indexOf(":") + 1);
		if (alarm_id === global_alarm_timestamp.toString()) {
			if (alarm_desc === "update_all") {
				console.log("Syncing");
				bgSync();
			} else if (alarm_desc === "update_releases") {
				console.log("Updating releases");
				bgUpdateReleases();
			}
		}
		else {
			console.log("Deleting old alarm: " + alarm.name);
			chrome.alarms.clear(alarm.name);
		}
	}
}

/**
 * check message passed from another script and execute based on it
 * @param {Object} message
 * @param {Object} sender
 * @param {function(Object)} sendResponse
 */
function checkMessage(message, sender, sendResponse) {
	if (message) {
		if (message.hasOwnProperty("src") && message.src === "en_popup") {
			if (message.title === "UPDATED_PREFERENCE") {
				bgUpdatePrefs();
				var response = {
					src: "en_bg",
					title: "ACK_UPDATED_PREFERENCE"
				};
				sendResponse(response);
			} else if (message.title === "REQ_UPDATE_BADGE") {
				updateBadge();
				var response = {
					src: "en_bg",
					title: "ACK_UPDATE_BADGE"
				};
				sendResponse(response);
			}
		}
	}
}

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

/**
 * opens the link associated with a notification in a new tab
 * @param {string} notif_id
 */
function openNotificationLink(notif_id) {
	chrome.tabs.create({ active: true, url: notif_id });
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
	chrome.runtime.onInstalled.addListener(bgSync);
	chrome.alarms.onAlarm.addListener(checkAlarm);
	bgLoadPrefs(function () {
		bgApplyPrefs();
	});
}
bgInit();