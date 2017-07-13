var global_alarm_timestamp = Date.now();

function bgSync() {
	pullUserSessionInfo(function (current_user_id, logged_in_user_id) {
		isFirstSession(function (first_session) {
			if (first_session) {
				if (logged_in_user_id && logged_in_user_id !== "No User") {
					initializeNewSession(logged_in_user_id, function () {
						// TODO: consider adding initial checks for all series' latest release
					});
				}
			} else {
				pullAllData();
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
	chrome.alarms.create(alarm_name, { periodInMinutes: 1 });
}

function scheduleSyncs() {
	var alarm_name = "update_all:" + global_alarm_timestamp;
	chrome.alarms.create(alarm_name, { periodInMinutes: 10 });
}

function backgroundInit() {
	scheduleReleaseUpdates();
	scheduleSyncs();
	beginListeningMUComm();
	chrome.runtime.onInstalled.addListener(backgroundInit);
	chrome.alarms.onAlarm.addListener(checkAlarm);
}

backgroundInit();