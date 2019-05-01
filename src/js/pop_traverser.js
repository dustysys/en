/*#############################################################################
File: pop_traverser.js

Functions in this file have the primary purpose of traversing the DOM to
obtain a DOM element property, the DOM element itself or multiple DOM elements.
Some functions must do some additional processing to determine the target
elements but do not modify the state of any elements or underlying data.
#############################################################################*/

/**
 * @param {Element} page_button
 * @returns {Element}
 */
function getPageButtonsPage(page_button) {
	return page_button.closest('.page');
}

/**
 * @param {Element} series_row
 * @returns {Element}
 */
function getSeriesRowsPage(series_row) {
	return series_row.closest('.page');
}

/**
 * @param {Element} page_button
 * @returns {Element}
 */
function getSeriesTablesPage(series_table) {
	return series_table.closest('.page');
}

/**
 * @param {Element} title_block
 * @returns {Element}
 */
function getTitleBlocksTitleLink(title_block) {
	return title_block.querySelector('.titleLink');
}

/**
 * @param {Element} series_row
 * @returns {Element}
 */
function getSeriesRowsEditLinkButton(series_row) {
	return series_row.querySelector('.editLinkButton');
}

/**
 * @param {Element} link_button
 * @returns {Element}
 */
function getEditLinkButtonsLinkIcon(link_button) {
	return link_button.querySelector('.editLinkIcon');
}

/**
 * @param {Element} series_row
 * @returns {Element}
 */
function getSeriesRowsEditLinkWrap(series_row) {
	return series_row.querySelector('.editLinkWrap');
}

/**
 * @param {Element} input_link
 * @returns {Element}
 */
function getInputLinksSeriesRow(input_link) {
	return input_link.closest('.seriesRow');
}

/**
 * @param {Element} series_row
 * @returns {Element}
 */
function getSeriesRowsUpToDateButton(series_row) {
	var uptodate_button = series_row.querySelector('.upToDateButton');
	return uptodate_button;
}

/**
 * @param {Element} series_row
 * @returns {Element}
 */
function getSeriesRowsSeriesSelectWrap(series_row) {
	var select_wrap = series_row.querySelector('.seriesSelectWrap');
	return select_wrap;
}

/**
 * @param {Element} series_row
 * @returns {Element}
 */
function getSeriesRowsSeriesSelectButton(series_row) {
	var select_button = series_row.querySelector('.seriesSelectButton');
	return select_button;
}

/**
 * @param {Element} series_row
 * @returns {Element}
 */
function getSeriesRowsTable(series_row) {
	return getSeriesRowsWrap(series_row).closest('.seriesTable');
}

/**
 * @param {Element} series_row
 * @returns {Element}
 */
function getSeriesRowsWrap(series_row) {
	return series_row.parentElement;
}
/**
 * @param {Element} series_row
 * @returns {Element}
 */
function getSeriesRowsTitleLink(series_row) {
	return series_row.querySelector('.titleLink');
}
/**
 * @param {Element} title_link
 * @returns {Element}
 */
function getTitleLinksSeriesRow(title_link) {
	return title_link.closest('.seriesRow');
}

/**
 * @param {Element} edit_link_button
 * @returns {Element}
 */
function getEditLinkButtonsTitleBlock(edit_link_button) {
	return edit_link_button.closest('.seriesTitleBlock');
}

/**
 * @param {Element} edit_link_icon
 * @returns {Element}
 */
function getEditLinkIconsTitleBlock(edit_link_icon) {
	return edit_link_icon.closest('.seriesTitleBlock');
};

/**
 * @param {Element} field
 * @returns {Element}
 */
function getReleaseFieldsSeriesRow(field) {
	return field.closest('.seriesRow');
}
/**
 * @param {Element} field
 * @returns {Element}
 */
function getReleaseFieldsReleaseDisplay(field) {
	return field.parentElement;
}

/**
 * @param {Element} input
 * @returns {Element}
 */
function getReadInputsReleaseLine(input) {
	return input.parentElement;
}

/**
 * @param {Element} button
 * @returns {Element}
 */
function getUpToDateButtonsSeriesRow(button) {
	return button.closest('.seriesRow');
}

/**
 * @param {Element} opt_select
 * @returns
 */
function getOptionSelectsEditText(opt_select) {
	return opt_select.nextElementSibling.children[1];
}

/**
 * @param {Element} edit_text
 * @returns
 */
function getEditTextsOptionSelect(edit_text) {
	return edit_text.parentElement.previousElementSibling;
}

/**
 * gets the currently displayed list table
 * @returns {Element}
 */
function getCurrentSeriesTable() {
	var list_id = getCurrentListId();
	return document.querySelector('.seriesTable[list_id=' + list_id + ']');
}

function getCurrentSeriesPage() {
	let table = getCurrentSeriesTable();
	return getSeriesTablesPage(table);
}

/**
 * gets the series id associated with series row element
 * @param {Element} series_row
 * @returns {string}
 */
function getSeriesRowsId(series_row) {
	return series_row.getAttribute("series_id").substring(1);
}

/**
 * gets currently shown list
 * @returns
 */
function getCurrentListId() {
	return document.getElementById("currentListSelect").value;
}

/**
 * gets currently active move-to list
 * @returns
 */
function getMoveToListId() {
	return getManageListId();
}

/**
 * gets manage-series list select's current choice
 * @returns {string}
 */
function getManageListId() {
	return document.getElementById("manageSeriesListSelect").value;
}

/**
 * gets the DOM table element containing the specified list
 * @param {string} list_id
 * @returns {Element}
 */
function getSeriesTableByListId(list_id) {
	return document.querySelector(".seriesTable[list_id=" + list_id + "]");
}

/**
 * checks if filter is applied
 * @returns
 */
function listFilterIsInUse() {
	return exists(document.getElementById("seriesRowListFilter").value);
}

/**
 * evaluates whether manage mode is currently on
 * @returns {boolean}
 */
function manageModeOn() {
	var toggle = document.getElementById("manageSeriesButton").getAttribute("toggle") === "on";
	return toggle;
}

/**
 * gets all series rows whose self and parents arent hidden
 * @returns {Element[]}
 */
function getVisibleSeriesRows() {
	return getVisibleElementsByClass("seriesRow");
}

/**
 * gets all visible elements of the DOM class specified
 * @param {string} class_name
 * @returns {Element[]}
 */
function getVisibleElementsByClass(class_name) {
	var vis_els = [];
	var els = document.body.querySelectorAll('.' + class_name);
	for (var i = 0; i < els.length; i++) {
		if (elementIsVisible(els[i])) {
			vis_els.push(els[i]);
		}
	}
	return vis_els;
}

/**
 * gets all the series row elements that could be on screen
 * @returns {Element[]}
 */
function getOnScreenSeriesRows() {
	var scroll_pos = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
	var num_rows_fit_onscreen = getNumRowsFitOnScreen();
	var vert = getSeriesRowVerticalSize();
	var index = Math.round(scroll_pos / vert);
	//buffer rows for rounding errors
	var buffer_rows = 3;
	var start_row = index - buffer_rows;
	if (start_row < 0) start_row = 0;
	var end_row = index + num_rows_fit_onscreen + buffer_rows;
	var vis_rows = getVisibleSeriesRows();
	var onscreen_rows = Array.prototype.slice.call(vis_rows, start_row, end_row);

	return onscreen_rows;
}