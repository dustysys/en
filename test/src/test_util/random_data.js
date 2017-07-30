
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

function intRandom(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function boolRandom() {
	return Math.random() >= 0.5;
}

function randomDate(start, end) {
	var date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	return date.toISOString();
}

function seriesNamesArrayRandom(size_arr) {
	var series_name_arr = seriesNamesArray1000();
	shuffleFY(series_name_arr);
}

function chapterRandom() {

}

function volumeRandom() {

}

function dateRandom() {

}

function groupsRandom() {
}

function seriesIdRandom() {

}

function releaseArrayRandom(size_arr) {

}

function seriesArrayRandom(size_arr, num_releases) {

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
	return default_list_arr[intRandom(0, 4)];
}

function customListRandom(num_series, num_releases) {
	return customListsRandom(1, num_series, num_releases);
}

function dataRandom(num_custom_lists, num_series, num_releases) {

}