

function readListExampleBasic1(){
    var list = {
			"list_id": "read",
			"list_name": "Reading List",
			"list_type": "read",
            "series_list": []
    }

    list.series_list.push(seriesExampleBasic1());
    list.series_list.push(seriesExampleBasic2());
    list.series_list.push(seriesExampleBasic3());

    return list;
}

function wishListExampleBasic1(){
    var list = {
			"list_id": "wish",
			"list_name": "Wish List",
			"list_type": "wish",
            "series_list": []
    }

    list.series_list.push(seriesExampleBasic4());
    list.series_list.push(seriesExampleBasic5());
    list.series_list.push(seriesExampleBasic6());

    return list;
}