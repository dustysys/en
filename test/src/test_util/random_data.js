
function shuffleFY(arr) {
	var i = 0
		, j = 0
		, temp = null

	for (i = arr.length - 1; i > 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1))
		temp = arr[i]
		arr[i] = arr[j]
		arr[j] = temp
	}
}

// min inclusive, max exclusive
function intRandom(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function boolRandom() {
	return Math.random() >= 0.5;
}

function dateRandom(start, end) {
	if (!start) start = new Date("1/1/2000");
	if (!end) end = new Date("12/1/2017");
	var date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	return date.toISOString();
}

function seriesTitlesArrayRandom(size_arr) {
	var series_title_arr = seriesTitlesArray1000();
	shuffleFY(series_title_arr);
	return series_title_arr;
}

function chapterRandom() {
	var chapter;
	if (Math.random() >= 0.9) {
		chapter = "";
	} else chapter = intRandom(0, 800).toString();

	return chapter;
}

function volumeRandom() {
	var volume;
	if (Math.random() >= 0.6) {
		volume = "";
	} else volume = intRandom(1, 20).toString();

	return volume;
}

// TODO: change from constant to pull from random groups
function groupsRandom(num_groups) {
	return "GROUP_NAME";
}

function seriesIdRandom() {
	return intRandom(1, 100000).toString();
}

function seriesIdArrayRandom(size_arr) {	
	var arr = []
	while (arr.length < size_arr) {
		var id = seriesIdRandom();
		if (arr.indexOf(id) > -1) continue;
		arr.push(id);
	}
	return arr;
}

function releaseArrayRandom(size_arr) {
	var release_arr = [];
	var series_title_arr = seriesTitlesArrayRandom(size_arr);

	for (var i = 0; i < size_arr; i++) {
		var release = {
			date: dateRandom(),
			title: series_title_arr[i],
			volume: volumeRandom(),
			chapter: chapterRandom(),
			groups: groupsRandom(),
			marked_seen: boolRandom()
		};
		release_arr.push(release);
	}
	return release_arr;
}

function seriesArrayRandom(size_arr, num_releases) {
	var series_arr = [];
	var release_arr = releaseArrayRandom(num_releases);
	var series_id_arr = seriesIdArrayRandom(size_arr);
	var series_title_arr = seriesTitlesArrayRandom(size_arr);
	var releases_left = num_releases;

	for (var i = 0; i < size_arr; i++) {
		var series = {
			series_id: series_id_arr[i],
			title: series_title_arr[i],
			mu_user_volume: volumeRandom(),
			mu_chapter_volume: chapterRandom(),
			date_added: dateRandom(),
			tracked: boolRandom(),
			user_link: "",
			unread_releases : [],
			latest_read_release: {},
			latest_unread_release: {},
			last_update_was_manual: boolRandom(),
			no_published_releases: Math.random() >= 0.9
		};
		series.entime_updated = dateRandom();
		series_arr.push(series);
	}

	while (releases_left > 0) {
		var series = series_arr[intRandom(0, series_arr.length)];
		var release = release_arr[releases_left - 1];
		if (!exists(series.latest_read_release) && boolRandom()) {
			series.latest_read_release = release;
		} else if (releaseIsNew(series, release)) {
			addNewRelease(release, series);
		} else {
			series.unread_releases.push(release);
		}

		series.no_published_releases = false;
		releases_left--;
	}

	return series_arr;
}

function dataRandom(num_custom_lists, num_series, num_releases) {
	var lists = [];
	var series_arr = seriesArrayRandom(num_series, num_releases);
	var series_left = series_arr.length;
	lists.push(getEmptyDefaultListById('read'));
	lists.push(getEmptyDefaultListById('wish'));
	lists.push(getEmptyDefaultListById('complete'));
	lists.push(getEmptyDefaultListById('unfinished'));
	lists.push(getEmptyDefaultListById('hold'));
	for (var i = 0; i < num_custom_lists; i++) {
		var list_num = (i + 1).toString();
		var custom_list = {
			list_id: "user" + list_num,
			list_name: "usr_" + list_num,
			list_description: "No Description",
			series_list: []
		};
		lists.push(custom_list);
	}

	while (series_left) {
		var list = lists[intRandom(0, 5 + num_custom_lists)];
		list.series_list.push(series_arr[series_left - 1]);
		series_left--;
	}

	return { lists: lists };
}