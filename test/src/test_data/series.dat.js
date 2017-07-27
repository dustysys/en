
/**
 * No releases read or unread
 * 
 * @returns {Series}
 */
function seriesExampleBasic1(){
    var series = 
        {
            "date_added": "",
            "last_update_was_manual": true,
            "mu_user_chapter": "350",
            "mu_user_volume": "1",
            "no_published_releases": false,
            "series_id": "88",
            "title": "Berserk",
            "tracked": true,
            "unread_releases": []
        };

    return series;
}

/**
 * 2 unread releases, no read releases
 * 
 * @returns 
 */
function seriesExampleWithUnreadReleases1(){
    var series =  
    {
        "date_added": "",
        "last_update_was_manual": true,
        "latest_unread_release": {
            "chapter": "1055-1057",
            "date": "2017-07-26T04:00:00.000Z",
            "groups": "Hyorinmaru",
            "marked_seen": false,
            "title": "Martial World (Novel)",
            "volume": ""
        },
        "mu_user_chapter": "1045",
        "mu_user_volume": "1",
        "no_published_releases": false,
        "series_id": "128696",
        "title": "Martial World (Novel)",
        "tracked": true,
        "unread_releases": [
            {
                "chapter": "1055",
                "date": "2017-07-26T04:00:00.000Z",
                "groups": "Hyorinmaru",
                "marked_seen": false,
                "title": "Martial World (Novel)",
                "volume": ""
            },
            {
                "chapter": "1055-1057",
                "date": "2017-07-26T04:00:00.000Z",
                "groups": "Hyorinmaru",
                "marked_seen": false,
                "title": "Martial World (Novel)",
                "volume": ""
            }
        ]
    };

    return series;
}