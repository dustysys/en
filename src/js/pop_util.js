/*#############################################################################
File: pop_util.js

Functions defined here process are useful for determining information about
the popup or its elements. Though this usually requiring some processing these
functions do not modify the state of the DOM or their underlying data.
#############################################################################*/

/**
 * gives total height of the series row class element
 * @returns {Number}
 */
function getSeriesRowVerticalSize() {
	var cs = window.getComputedStyle(document.documentElement);
	var row_height = cs.getPropertyValue('--row-height');
	var row_margin = cs.getPropertyValue('--row-margin-vert');
	var row_border = cs.getPropertyValue('--std-border-width');
	var vert = parseInt(row_height) + parseInt(row_margin) + parseInt(row_border) + parseInt(row_border);
	return vert;
}

/**
 * gives num rows that could fit onscreen based on css
 * @returns {Number}
 */
function getNumRowsFitOnScreen() {
	var cs = window.getComputedStyle(document.documentElement);
	var window_height = parseInt(cs.getPropertyValue('--popup-height'));
	var vert = getSeriesRowVerticalSize();
	var header_height = parseInt(cs.getPropertyValue('--navbar-height'));
	var num_rows_fit_onscreen = Math.round((window_height - header_height) / vert);
	return num_rows_fit_onscreen;
}

/**
 * evaluates if two rows are for the same series
 * @param {Element} series_row1
 * @param {Element} series_row2
 * @returns
 */
function seriesRowsAreSame(series_row1, series_row2) {
	return series_row1.getAttribute("series_id") === series_row2.getAttribute("series_id")
}

/**
 * evaluates if series row is the last non-hidden row in sort order
 * @param {Element} series_row
 * @returns {boolean}
 */
function isLastVisibleSeriesRow(series_row) {
	var is_last = false;
	var vis_rows = getVisibleSeriesRows();
	var vis_index = getIndexOfVisibleSeriesRow(series_row);
	if (vis_index === vis_rows.length - 1) return true;
	else return false;
}

/**
 * gets the index of a series row relative to other visible rows
 * @param {Element} series_row
 * @returns {Number}
 */
function getIndexOfVisibleSeriesRow(series_row) {
	var visible_rows = getVisibleSeriesRows();
	for (var index = 0; index < visible_rows.length; index++) {
		if (seriesRowsAreSame(series_row, visible_rows[index])) {
			return index;
		}
	}
}

/**
 * gets index of a series row relative to its wrapper's
 * siblings in the DOM
 * @param {Element} series_row
 * @returns {Number}
 */
function getIndexOfSeriesRowInDOM(series_row) {
	var el = getSeriesRowsWrap(series_row);
	var el_index = 0;
	for (el_index; (el = el.previousSibling); el_index++);
	return el_index;
}

/**
 * evaluates if element is visible
 * @param {Element} el
 * @returns {boolean}
 */
function elementIsVisible(el) {
	return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
}

/**
 * gets index of an element relative to its siblings in DOM
 * @param {Element} el
 * @returns {Number}
 */
function getIndexOfElementInDOM(el) {
	var el_index = 0;
	for (el_index; (el = el.previousSibling); el_index++);
	return el_index;
}

/**
 * attempts to make slightly invalid urls valid
 * @param {string} url
 * @returns {string}
 */
function validateUrl(url) {
	var has_www = (url.toLowerCase().includes("www."));
	var has_http = (url.toLowerCase().includes("http://"));
	var has_https = (url.toLowerCase().includes("https://"));
	if (!has_www) {
		return "http://www." + url;
	} else if (!has_http && !has_https) {
		return "http://" + url;
	} else return url;
}