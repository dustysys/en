/*#############################################################################
File: pop_handler.js

These handlers determine the immediate course of action upon an input event
from the user toward global popup elements, such as the navbar. Some of
these elements are only available to interact with in certain display states.
If a handler needs additional processing or access to data it will escalate
to calling an action function.
#############################################################################*/

/**
 * turns series manage mode on
 * @param {Event} event
 */
function handleManageSeries(event) {
	if (!pop.block_transitions || !pop.prefs.animations.enabled) {
		pop.block_transitions = true;
		//event may be button or its description
		var manage_button = document.getElementById("manageSeriesButton");
		var toggle = toggleElement(manage_button);
		animateToggleManageMode(toggle, toggleManageModeVisibility);
	}
}

/**
 * initiates animation and appearance/building of option features on clicking option button
 * @param {Event} event
 */
function handleToggleOptions(event) {
	var toggle = toggleElement(event.target);
	// load page before animation
	toggleOptionPageVisibility(toggle);

	animateToggleOptionMode(toggle, toggleOptionModeVisibility);
}

/**
 * Toggles the series select for all elements
 * @param {Event} event
 */
function handleSelectAllSeries(event) {
	var toggle = toggleElement(event.target);
	var select_buttons = getVisibleElementsByClass("seriesSelectButton");
	if (select_buttons !== null) {
		for (var i = 0; i < select_buttons.length; i++) {
			select_buttons[i].setAttribute("toggle", toggle ? "on" : "off");
		}
	}
}

/**
 * switches which list is currently shown
 * @param {Event} event
 */
function handleCurrentListChange(event) {
	document.getElementById("seriesRowListFilter").value = "";
	var filter = "";
	filterList(filter);
	resetAllSelectSeriesButtons();
	changeToSelectedCurrentList();
}

/**
 * shows/hides series rows based on input characters in list filter
 * @param {Event} event
 */
function handleListFilter(event) {
	var input = event.target;
	var filter = input.value.toUpperCase();
	filterList(filter);
}

/**
 *  DEV TOOLS HANDLERS
 *
 *	handlers for the dev tool buttons activating
 *  convenience functions for debugging
 */

function handleClickedClearAllData() {
	clearAllData();
}

function handleClickedPullAllData() {
	pullAllData();
}

function handleClickedUpdateLists() {
	updateLists();
}

function handleClickedRebuildPopup() {
	rebuildPopup();
}
