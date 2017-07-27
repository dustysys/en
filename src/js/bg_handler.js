/*#############################################################################
File: bg_handler.js

These functions run based on events subscribed to by the background script.
#############################################################################*/

/**
 * Syncs user's data. It also checks if the session is valid and
 * attempts a new session if it isn't.
 */
function bgSync() {
	sessionIsValid(function (valid_session) {
		if (valid_session) {
			pullAllData();
			updateBadge();
		}
		else {
			attemptNewSession(
				function success() {
					console.log("New session initialized from background script");
					updateBadge();
				}, function error(msg) {
					console.log("New session failed to initialize from background script");
					console.warn("Warning: " + msg);
				}
			);
		}
	});
}

/**
 * Updates lists with new releases
 */
function bgUpdateReleases() {
	updateLists(function () {
		updateBadge();
	});
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

/**
 * opens the link associated with a notification in a new tab
 * @param {string} notif_id
 */
function openNotificationLink(notif_id) {
	chrome.tabs.create({ active: true, url: notif_id });
}