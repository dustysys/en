/**
 * decides what to do when en is installed or updated, especially when
 * an update requires special handling to make existing data fit new code
 * @param details
 */
function bgNewInstall(details) {
	var reason = details.reason;
	var old_version = details.previousVersion;

	if (reason === "install") {
		clearAllData(bgSync);
	} else if (reason === "updated") {
		switch (old_version) {
			case "0.1.2.3210":
				fillMarkedSeen();
				break;
		}
	}
}

/**
 * add marked seen field added in 0.1.2.3220
 * @param {function(Data)} callback
 */
function fillMarkedSeen(callback) {
	loadData(function (data) {
		data.lists.forEach(function (data_list) {
			data_list.series_list.forEach(function (data_series) {
				if (exists(data_series.latest_unread_release)) {
					data_series.latest_unread_release.marked_seen = false;
				}
				data_series.unread_releases.forEach(function (release) {
					release.marked_seen = false;
				});
			});
		});
		saveData(data, callback);
	});
}