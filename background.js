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
				// Do update
			}
		});
	});
}

function bgUpdateReleases() {
}

function checkAlarm(alarm) {
	if (alarm && alarm.name === "update_all") {
		scheduleNextSync();
		bgSync();
	} else if (alarm && alarm.name === "update_releases") {
		scheduleNextReleaseUpdate();
		bgUpdateReleases();
	}
}

function scheduleNextReleaseUpdate() {
	chrome.alarms.create("update_releases", { periodInMinutes: 3 });
}

function scheduleNextSync() {
	chrome.alarms.create("update_all", { periodInMinutes: 10 });
}

function backgroundInit() {

}

scheduleNextReleaseUpdate();
scheduleNextSync();
beginListeningMUComm();
chrome.runtime.onInstalled.addListener(backgroundInit);
chrome.alarms.onAlarm.addListener(checkAlarm);