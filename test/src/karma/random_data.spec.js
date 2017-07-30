
describe('Data Randomization', () => {
	describe('dataRandom(num_custom_lists, num_series, num_releases0', () => {
		describe('should give data with the specified number of', () => {
			it('lists', () => {
				var data = dataRandom(4, 1, 1);
				var num_lists = getNumLists(data.lists);
				num_lists.should.equal(5 + 4);
			});

			it('series', () => {
				var data = dataRandom(2, 20, 10);
				var num_series = getNumTotalSeries(data.lists);
				num_series.should.equal(20);
			});

			it('releases', () => {
				var data = dataRandom(1, 3, 5);
				var num_releases = getNumTotalReleases(data.lists);
				num_releases.should.equal(5);
			});
		});
	});
});

function getNumTotalReleases(data_lists) {
	var num = 0;

	data_lists.forEach(list => {
		list.series_list.forEach(series => {
			if (exists(series.latest_read_release)) {
				num++;
			}
			if (exists(series.unread_releases)) {
				num += series.unread_releases.length;
			}
		});
	});

	return num;
}