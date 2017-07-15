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

function checkMessage(message, sender, sendResponse) {
	if (message) {
		if (message.hasOwnProperty("src") && message.src === "en_popup") {
			if (message.title === "UPDATED_PREFERENCE") {
				bgUpdatePrefs();
				var response = {
					src: "en_bg",
					title: "ACK"
				}
				sendResponse(response);
			}
		}
	}
}

// TODO: send popup messages about new updates
function sendMessage() {
}

function scheduleReleaseUpdates() {
	var alarm_name = "update_releases:" + global_alarm_timestamp;
	chrome.alarms.create(alarm_name, { periodInMinutes: global_pref_release_update.interval });
}

function scheduleSyncs() {
	var alarm_name = "update_all:" + global_alarm_timestamp;
	chrome.alarms.create(alarm_name, { periodInMinutes: global_pref_list_sync.interval });
}

// listens for notification click events 
// on click creates a new tab using ID of notification as URL.
function listenNotifications() {
	chrome.notifications.onClicked.addListener(function (notif_id) {
		chrome.tabs.create({ active: true, url: notif_id });
	});
}

function listenStartup() {
	chrome.runtime.onStartup.addListener(function () {
		updateBadge();
	});
}

function listenMessages() {
	chrome.runtime.onMessage.addListener(checkMessage);
}

function bgLoadPrefs(callback) {
	loadAllPrefs(function (prefs) {
		global_pref_release_update = prefs["release_update"];
		global_pref_list_sync = prefs["list_sync"];
		global_pref_notifications = prefs["notifications"];
		callback();
	});
}

function bgApplyPrefs() {
	if (global_pref_release_update.enabled) {
		scheduleReleaseUpdates();
	}
	if (global_pref_list_sync.enabled) {
		scheduleSyncs();
	}
	if (global_pref_notifications.enabled) {
		listenNotifications();
	}
}

function bgUpdatePrefs() {
	// invalidate old preferences' alarms
	global_alarm_timestamp = Date.now();
	bgLoadPrefs(function () {
		bgApplyPrefs();
	});
}

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