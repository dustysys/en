describe('removeSeriesFromListsById(data_lists, series_id)', ()=>{
    it('should remove the series', ()=>{
        var list1 = readListExampleBasic1();
        var list2 = wishListExampleBasic1();
        var series = list1.series_list[1];
        var series_id = series.series_id;
        removeSeriesFromListsById([list1, list2], series_id);
        var has_series = list1.series_list.includes(series);
        (has_series).should.be.false;
    });
});

describe('removeSeriesArrayFromListById(data_lists, list_id, series_id_arr)', ()=>{
    it('should remove all the series in the array from the list', ()=>{
        var list1 = wishListExampleBasic1();
        var list2 = readListExampleBasic1();
        var list_id = list1.list_id;
        var series_id_arr = [];
        list1.series_list.forEach( series => {
            series_id_arr.push(series.series_id);
        });
        removeSeriesArrayFromListById([list1, list2], list_id, series_id_arr);
        (list1.series_list.length).should.equal(0);
    });
 });

describe('getNumLists(data_lists)', ()=>{
    it('should get the list count', ()=>{
        var list1 = readListExampleBasic1();
        var list2 = wishListExampleBasic1();
        getNumLists([list1, list2]).should.equal(2);
    });
});