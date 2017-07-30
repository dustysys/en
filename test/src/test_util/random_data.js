﻿
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
	shuffleFY(series_name_arr);
	return series_title_arr;
}

function seriesTitleRandom() {
	return seriesTitlesArrayRandom(1)[0];
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

	for (var i = 0; i < size_arr; i++) {
		var release = {
			date: dateRandom(),
			title: seriesTitleRandom(),
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
		series.entime_updated = dateRandom(series.date_added);
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
}

// returns all 5 default lists
function defaultListsRandom(num_series, num_releases) {

}

function customListsArrayRandom(size_arr, num_series, num_releases) {

}

function seriesRandom(num_releases) {
	return seriesArrayRandom(1, num_releases);
}

function defaultListRandom(num_series, num_releases) {
	var default_list_arr = defaultListArrayRandom(num_series, num_releases);
	return default_list_arr[intRandom(0, 5)];
}

function customListRandom(num_series, num_releases) {
	return customListsRandom(1, num_series, num_releases);
}

function dataRandom(num_custom_lists, num_series, num_releases) {
	var num_default_series = intRandom(0, num_series);
	var num_custom_series = num_series - num_default_series;
	var num_default_releases = intRandom(0, num_releases);
	var num_custom_releases = num_releases - num_default_releases;


}