## Testing

Currently there is no automated testing solution. Getting standard testing options to play nice with the Chrome extension API should be done at some point, but until then this list should be applied via manual visual inspection to check features while making changes, and all of these tests should be checked to demonstrate application compliance before merging to master. It is not exhaustive but executes all the major moving parts of the application. It can also be read as a specification for application behavior.

## en core Functions

### Add/Edit/Delete list

1. Create a new user list on MU, confirm it is available within the popup.
2. Edit the name of a list on MU, confirm its new name is present in the popup and its contents have not changed.
3. Delete a list on MU, confirm it is no longer present within the popup. Also confirm that the previous contents of the list are now in the Reading List.

### Add series

1. Add a series from its MU series page to a pre-set list, confirm it is available within the popup.
2. Add a series from its MU series page to a user-created list, confirm it is available within the popup.

### Remove Series

1. Remove a series from a list on MU, confirm it is removed from the corresponding popup list page. 
2. Remove a series from a list in the popup, confirm it is removed from the corresponding MU list page.
3. Remove a series from a user-created list in the popup, confirm it is removed from the corresponding MU list page.

### Move Series List to List

1. Move a series to another list from the series' own page on MU, confirm it has moved on the popup.
2. Move multiple series from one list to another list on MU, confirm they have moved on the popup.
3. Move multiple series from one list to another list on the popup, confirm they have moved on MU.

### Modify Series

1. Set the chapter and volume of a series on the MU list page, confirm it has been changed in the popup.
2. Increment the chapter and volume of a series, confirm it has been changed in the popup.
3. Set the chapter and volume of a series in the popup, confirm it has been changed in the MU list page.
4. Mark a series up to date, and if its new release's chapter and volume name are parseable, confirm it has been changed on the MU list page.

## Sessions

1. Clear all extension data, log out of MU and open the popup. You should be directed to a login page.
2. Clear all extension data, but be logged in to MU and open the popup. All the series data should be loaded after a few seconds.
3. Without clearing data, log out and open the popup. Use of the popup should not be hindered by not being logged in.
4. Disconnect the internet connection and open the popup. Using the popup should not be hindered by being offline.
5. With an internet connection and without clearing data, log in to a different account than the one associated with your last en session. After opening the popup and waiting a few seconds, the new account's data should be loaded.

## User input
### Buttons
#### Mark up-to-date
1. Click the mark up-to-date button on a series with new releases. Confirm the latest read display has changed to show the latest chapter. Confirm the series' row has shifted to its alphabetical location amongst the series without new read releases. Confirm that the up-to-date button has disappeared.
2. Click the mark up-to-date button. Move the chapter to an unloaded list. Load that list and confirm that the button has not reappeared.
3. Click the mark up-to-date button. Move the chapter to a previously loaded list. Change to that list and confirm that the button has not reappeared.
 
#### Series Select
1. Click a series' series select button. Confirm that it changes color. Move to another list, then return to the list it was on. Confirm it is now in the deselected state.
2. Click a series select, then hold shift and click a series select further away. Confirm that all series selects between and including these two clicked buttons have toggled their values compared to the start of the test.
3. Click a few series series selects and then click the delete button. Confirm the series rows disappear from the list. Reload the popup and confirm they have not reappeared.

#### Link Edit
1. Click a series' link button. Confirm that an input field appears. Confirm that it is focused.

#### Title Link
1. Click a edit link button of a series which has a link associated with it. Observe the value of the input field. After deselecting or reloading the popup, click the Title of this series. Confirm that a new tab is opened with the url being the observed value of the input field.
2. Click the title of a series which does not have a link associated with it. Confirm that a new tab is opened which contains the series' MU series page.

#### Volume/Chapter
1. Click a series' latest read volume. Confirm that two input fields appear. Confirm the first input field is prefaced by the text "v. ", and that the second input field is prefaced by the text "c. ". Also confirm the latest read volume has disappeared, and that the value of the disappeared volume is now inside the first input field. Confirm that the first input field is focused.
2. Click a series' latest read chapter. Confirm that two input fields appear. Confirm the first input field is prefaced by the text "v. ", and that the second input field is prefaced by the text "c. ". Also confirm the latest read chapter has disappeared, and that the value of the disappeared chapter is now inside the second input field.
Confirm that the second input field is focused.
3. Click a series' whose latest read chapter/volume line contains "n/a". Confirm that two input fields appear. Confirm the first input field is prefaced by the text "v. ", and that the second input field is prefaced by the text "c. ". Confirm that the second input field is focused.

#### Manage Series
1. Click the manage series button and confirm that the delete button, move series button, move series selection list and select all button all appear. Also confirm that for each series a link button and a series select button appear. Confirm that a series that had a uptodate button no longer shows its uptodate button. The state that has been turned on will be henceforth referred to as manage mode.
2. Enter manage mode. Then, click the manage series button. Confirm that the elements specified to disappear in the previous step have reappeared, and confirm elements specified to appear in the previous step have disappeared.

#### Move
1. Select a group of series and click the move button. Confirm that the series has moved to the list specified by the move list selection menu. Go to that menu and confirm the series is present. Reload the popup and confirm it is still present in that same list.

#### Delete 
1. Select a group of series and click the delete button. Confirm that these lists have disappeared. Reload the popup and confirm they have not reappeared.

#### Select All
1. Click the select all buttons. Confirm that the color of the select all button has changed. Confirm that the color of all the select series buttons have changed to that color. Click the select all button again. Confirm that it changes back to its previous color, and that color of all the select series buttons have changed back to that color.
2. Click the select all button. Now click a select series button. Confirm that the select all button has changed back to its previous color. 

### List Selections
#### Current List
1. Change the currently selected list to a different list. Confirm that the series from the new lists appear, and confirm that the series from the old list have disappeared. Change the currently selected list to the previous list and confirm that its series have reappeared.

#### Manage List
1. Select a group of series. Change the manage list to a different list than currently being viewed. Confirm that nothing happens. Then, click the move button. Confirm that those series have disappeared. Confirm that those series are now present in the list which was selected.

### Filters

Note that the use of the series filter should not affect any other behaviors of the popup. Therefore, all other steps that involve changing the state or appearance of a series row should be repeated with text in the series filter to confirm that the application behaves as if the filtered lists are their own table. No modifications or appearance changes that are not done globally to all lists or series should be done to those series which do not appear due to having been been filtered out.

#### Series Filter
1. Enter text into the series filter. Confirm only those series which contain the entered text in their title are visible, and confirm those that did not contain that text have disappeared. Remove the text from the list filter. Confirm that those series which had previously disappeared and have now reappeared in their original positions.
2. Enter text into the list filter. Change to a different list. Confirm that the list filter no longer has text in it, and confirm that all series on the new list are present, including those which do not contain the previously entered text in their title. Change back to the original list. Confirm that all series on the original list are now present, including those which do not contain the previously entered text in their title.

### Text fields
#### Volume/Chapter fields
1. With the volume field focused, click the chapter field. Confirm that the chapter field is focused.
2. With the chapter field focused, click the volume field. Confirm that the volume field is focused.
3. With either field selected, change the text inside the field. Click away from the fields. Confirm that the input fields have disappeared, and confirm that text representing the entered text in the fields have now appeared in place of the input fields. Reload the popup, and confirm that the text has not changed.

#### Link field
1. With a link field focused, click away from the link. Confirm that the link field disappears.
2. With a link field focused which did not previously contain a link, add a link which does not include 'http://', 'https://' or 'www.'. After deselecting the input field, click the series' edit link button and confirm the value inside is the same as the link entered, but with 'http://www.' prepended to it.
3. With a link field focused which did not previously contain a link, add a link which does not include 'http://', 'https://', but does contain 'www.'. After deselecting the input field, click the series' edit link button and confirm the value inside is the same as the link entered, but with 'http://www.' prepended to it.
4. With a link field focused which did not previously contain a link, add a link which includes either 'http://' or 'https://' and also contains 'www.'. After deselecting the input field, click the series' edit link button and confirm the value inside is the same as the link entered.
5. With a link focused which did not previously contain a link, add a link. Reload the popup, click the edit link button and confirm that the input field contains that link (subject to the modifications indicated by the previous steps.)
6. With a link focused which previously contained a link, add a new link. After deselecting the input field, click the series' edit link button and confirm that the new value is entered. Reload the popup, click the series' edit link button and confirm that new value is still entered.
7. With a link focused which previously contained a link, delete the link and enter nothing in its place. After deselecting the input field, click the series' edit link button and confirm that no value is entered. Reload the popup, click the series' edit link button and confirm that there is still no value entered.
