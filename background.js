var global_alarm_timestamp = Date.now();
var global_release_update_on = true;
var global_release_update_interval = 15;
var global_list_sync_on = true;
var global_list_sync_interval = 60;
var global_notifications_on = true;


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
			console.log("Clearing old alarm " + alarm.name);
			chrome.alarms.clear(alarm.name);
		}
	}
}

function scheduleReleaseUpdates() {
	var alarm_name = "update_releases:" + global_alarm_timestamp;
	chrome.alarms.create(alarm_name, { periodInMinutes: 15 });
}

function scheduleSyncs() {
	var alarm_name = "update_all:" + global_alarm_timestamp;
	chrome.alarms.create(alarm_name, { periodInMinutes: 60 });
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

function bgLoadPrefs(callback) {
	loadAllPrefs(function (prefs) {
		var global_release_update_on = prefs["release_update_on"];
		var global_release_update_interval = prefs["release_update_interval"];
		var global_list_sync_on = prefs["list_sync_on"];
		var global_list_sync_interval = prefs["list_sync_interval"];
		var global_notifications_on = prefs["notifications_on"];
		callback();
	});
}

function bgInit() {
	listenMUComm();
	listenStartup();
	chrome.runtime.onInstalled.addListener(bgSync);
	chrome.alarms.onAlarm.addListener(checkAlarm);
	bgLoadPrefs(function () {
		if (global_release_update_on) {
			scheduleReleaseUpdates();
		}
		if (global_list_sync_on) {
			scheduleSyncs();
		}
		if (global_notifications_on) {
			listenNotifications();
		}
	});
}

bgInit();