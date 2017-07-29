describe('addSeriesToList(data_list, series_list)', () => {
    var series1;
    var series2;
    var series3;
    var list;

    beforeEach(()=>{
        series1 = seriesExampleBasic1();
        series2 = seriesExampleBasic2();
        series3 = seriesExampleBasic3();

        list = {
            list_id:"read",
            list_name:"Reading List",
            series_list: []
        }
        
    });
    
    it('should add a series list to the list', () => {
        addSeriesToList(list, [series1, series2]);
        var has_series = list.series_list.includes(series1) && list.series_list.includes(series2);
        (has_series).should.be.true;
    });

    it('should preserve existing series in the list', ()=>{
        list.series_list = [series3];
        addSeriesToList(list, [series1, series2]);
        var has_series = list.series_list.includes(series3);
        (has_series).should.be.true;
    });
});


describe('removeSeriesFromListsById(data_lists, series_id)', () => {
    it('should remove the series', () => {
        var list1 = readListExampleBasic1();
        var list2 = wishListExampleBasic1();
        var series = list1.series_list[1];
        var series_id = series.series_id;
        removeSeriesFromListsById([list1, list2], series_id);
        var has_series = list1.series_list.includes(series);
        (has_series).should.be.false;
    });
});

describe('removeSeriesArrayFromListById(data_lists, list_id, series_id_arr)', () => {
    it('should remove all the series in the array from the list', () => {
        var list1 = wishListExampleBasic1();
		var list2 = readListExampleBasic1();

        var list_id = list1.list_id;
        var series_id_arr = [];
        list1.series_list.forEach(series => {
            series_id_arr.push(series.series_id);
		});

        removeSeriesArrayFromListById([list1, list2], list_id, series_id_arr);
        (list1.series_list.length).should.equal(0);
    });
});

describe('getNumLists(data_lists)', () => {
    it('should get the list count', () => {
        var list1 = readListExampleBasic1();
        var list2 = wishListExampleBasic1();
        getNumLists([list1, list2]).should.equal(2);
    });
});

describe('getLatestRelease(data_series))', () => {
    var series;
    beforeEach(() => {
        series = seriesExampleBasic1();
        series.latest_read_release = {};
        series.latest_unread_release = {};
        release1 = releaseExampleBasic1();
        release2 = releaseExampleBasic2();
        release1.date = "2017-07-27T04:00:00.000Z";
        release2.date = "2017-07-26T04:00:00.000Z";
    });

    it('should get the latest unread release', () => {
        series.latest_unread_release = release1;
        series.latest_read_release = release2;
        getLatestRelease(series).should.deep.equal(release1);
    });
    it('unless there is no latest unread release, in which case it should get the latest read release', () => {
        series.latest_read_release = release2;
        getLatestRelease(series).should.deep.equal(release2);
    });
    it('it should return empty if neither exists.', () => {
        var ex = exists(getLatestRelease(series));
        exists(getLatestRelease(series)).should.not.be.true;
    });
});

describe('hasSeries(data_list, series_id)', () => {
    var list;
    var present_series_id;
    var missing_series_id;
    beforeEach(() => {
        list = readListExampleBasic1();
        present_series_id = list.series_list[0].series_id;
        missing_series_id = "12345";
    });

    it('should report true if it has a series with the same id', () => {
        hasSeries(list, present_series_id).should.be.true;
    });
    it('and false if it doesn\'t', () => {
        hasSeries(list, missing_series_id).should.be.false;
    });
});

describe('hasList(data_lists, data_list)', () => {
    var list1;
    var list2;
    var list3;
    var listset;
    beforeEach(() => {
        list1 = readListExampleBasic1();
        list2 = wishListExampleBasic1();
        list3 = { list_id: "complete", list_name: "Complete List" };
        listset = [list1, list2];
    });

    it('should report true if it has a list with the same name and id', () => {
        hasList(listset, list1).should.be.true;
        hasList(listset, list2).should.be.true;
    });
    it('shouldn\'t report true if only the name or id match', () => {
        var list4 = readListExampleBasic1();
        var list5 = wishListExampleBasic1();
        list4.list_name = "On Hold";
        list5.list_id = "unfinished";
        hasList(listset, list4).should.be.false;
        hasList(listset, list5).should.be.false;
    });
    it('and should also report false if the list doesn\'t match at all', () => {
        hasList(listset, list3).should.be.false;
    });
});

describe('releaseCouldBeNewer(release1, release2)', () => {
    var release1;
    var release2;

    beforeEach(() => {
        release1 = releaseExampleBasic1();
        release2 = releaseExampleBasic2();
    })

    it('should return true when first releases date is newer', () => {
        release1.date = "2017-07-27T04:00:00.000Z";
        release2.date = "2017-07-26T04:00:00.000Z";
        releaseCouldBeNewer(release1, release2).should.be.true;
    });
    it('should also return true if their release dates are identical', () => {
        release1.date = "2017-07-23T04:00:00.000Z";
        release2.date = "2017-07-23T04:00:00.000Z";
        releaseCouldBeNewer(release1, release2).should.be.true;
    });
    it('should return false otherwise', () => {
        release1.date = "2017-07-01T04:00:00.000Z";
        release2.date = "2017-07-28T04:00:00.000Z";
        releaseCouldBeNewer(release1, release2).should.be.false;
    })
});

describe('releaseIsNew(data_series, release)', () => {
    var series;
    var release1;
    var release2;
    var release3;
    var release4;
    var release5;
    var release5_dup;

    beforeEach(() => {
        series = seriesExampleBasic1();
        release1 = releaseExampleBasic1();
        release2 = releaseExampleBasic2();
        release3 = releaseExampleBasic3();
        release4 = releaseExampleBasic4();
        release5 = releaseExampleBasic5();
        release5_dup = releaseExampleBasic5();
        series.latest_read_release = {};
        series.unread_releases = [];
    })
    describe('No existing releases:', () => {
        it('series should be new if series has no releases', () => {
            releaseIsNew(series, release1).should.be.true;
            releaseIsNew(series, release2).should.be.true;
            releaseIsNew(series, release3).should.be.true;
        });
        it('including if the series doesnt have release properties', () => {
            delete series.latest_read_release;
            delete series.unread_releases;
            delete series.latest_unread_release;

            releaseIsNew(series, release3).should.be.true;
            releaseIsNew(series, release4).should.be.true;
            releaseIsNew(series, release5).should.be.true;
        });
    });
    describe('With latest read release:', () => {
        beforeEach(() => {
            release5.date = "2017-07-23T04:00:00.000Z";
            release5_dup.date = "2017-07-23T04:00:00.000Z";
            series.latest_read_release = release5;
        });

        it('series should be new if newer than latest read release', () => {
            release1.date = "2018-08-24T04:00:00.000Z";
            release2.date = "2017-07-24T04:00:00.000Z";
            releaseIsNew(series, release1).should.be.true;
            releaseIsNew(series, release2).should.be.true;
        });

        it('or if their dates are identical', () => {
            release1.date = "2017-07-23T04:00:00.000Z";
            releaseIsNew(series, release1).should.be.true;
        });

        it('except when all their other properties are identical too.', () => {
            releaseIsNew(series, release5_dup).should.be.false;
        });

        it('and if its older, it isn\'t new', () => {
            release3.date = "2013-07-24T04:00:00.000Z";
            release4.date = "2017-07-20T04:00:00.000Z";
            releaseIsNew(series, release3).should.be.false;
            releaseIsNew(series, release4).should.be.false;
        });
    });

    describe('With latest unread release:', () => {
        beforeEach(() => {
            release5.date = "2017-07-23T04:00:00.000Z";
            release5_dup.date = "2017-07-23T04:00:00.000Z";
            series.latest_unread_release = release5;
        });

        it('series should be new if newer than latest unread release', () => {
            release1.date = "2018-08-24T04:00:00.000Z";
            release2.date = "2017-07-24T04:00:00.000Z";
            releaseIsNew(series, release1).should.be.true;
            releaseIsNew(series, release2).should.be.true;
        });

        it('or if their dates are identical', () => {
            release1.date = "2017-07-23T04:00:00.000Z";
            releaseIsNew(series, release1).should.be.true;
        });

        it('except when all their other properties are identical too.', () => {
            releaseIsNew(series, release5_dup).should.be.false;
        });

        it('and if its older, it isn\'t new', () => {
            release3.date = "2013-07-24T04:00:00.000Z";
            release4.date = "2017-07-20T04:00:00.000Z";
            releaseIsNew(series, release3).should.be.false;
            releaseIsNew(series, release4).should.be.false;
        });
    });

    describe('With unread releases:', () => {
        beforeEach(() => {
            release5_dup.date = "2017-08-10T04:00:00.000Z";
            release5.date = "2017-08-10T04:00:00.000Z"; // newest
            release3.date = "2017-07-25T04:00:00.000Z"; // 2nd newest
            release2.date = "2017-07-20T04:00:00.000Z"; // latest read
            series.latest_unread_release = release5;
            series.unread_releases = [release5, release3];
            series.latest_read_release = release2;
        });
        it('series should be new if newer than all releases', () => {
            release1.date = "2018-01-01T04:00:00.000Z";
            releaseIsNew(series, release1).should.be.true;
        });
        it('it shouldn\'t be new if it\'s in between', () => {
            release1.date = "2017-08-05T04:00:00.000Z";
            release4.date = "2017-07-23T04:00:00.000Z";
            releaseIsNew(series, release1).should.be.false;
            releaseIsNew(series, release4).should.be.false;
        });
        it('or if it\'s the oldest', () => {
            release1.date = "2001-01-01T04:00:00.000Z";
            releaseIsNew(series, release1).should.be.false;
        });
        it('or if it\'s completely identical to the newest', () => {
            releaseIsNew(series, release5_dup).should.be.false;
        });
        it('but if only the date is the same as the newest, it\'s new', () => {
            release1.date = "2017-08-10T04:00:00.000Z";
            releaseIsNew(series, release1).should.be.true;
        });
    });
});