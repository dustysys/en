

function parseMyListPage(list_page) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(list_page, "text/html");
	var elms = doc.querySelectorAll('[href^="https://www.mangaupdates.com/mylist.html?list="]');
	var parsed_lists = [];
	for (var i = 0; i < elms.length; i++) {
		var link = elms[i].getAttribute("href");
		var list_id = link.substring(link.indexOf("=") + 1);
		var list_name = elms[i].firstElementChild.textContent;
		var parsed_list = {
			list_id: list_id,
			list_name: list_name,
			list_type: "",
			series_list: []
		};
			parsed_lists.push(parsed_list);
	}
	return parsed_lists;
}