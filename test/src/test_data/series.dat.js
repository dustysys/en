
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

function seriesExampleBasic2(){
    var series = 
        {
            "date_added": "",
            "last_update_was_manual": true,
            "mu_user_chapter": "48",
            "mu_user_volume": "6",
            "no_published_releases": false,
            "series_id": "47410",
            "title": "Mill",
            "tracked": true,
            "unread_releases": []
        };

    return series;
}

function seriesExampleBasic3(){
    var series = 
         {
            "date_added": "",
            "last_update_was_manual": true,
            "mu_user_chapter": "20",
            "mu_user_volume": "3",
            "no_published_releases": false,
            "series_id": "54097",
            "title": "Magician (KIM Sarae)",
            "tracked": true,
            "unread_releases": []
        };

    return series;
}

function seriesExampleBasic4(){
    var series = 
        {
            "date_added": "",
            "last_update_was_manual": true,
            "mu_user_chapter": "85",
            "mu_user_volume": "1",
            "no_published_releases": false,
            "series_id": "81859",
            "title": "Mai Ball!",
            "tracked": true,
            "unread_releases": []
        };

    return series;
}

function seriesExampleBasic5(){
    var series = 
        {
            "date_added": "",
            "last_update_was_manual": true,
            "mu_user_chapter": "276",
            "mu_user_volume": "1",
            "no_published_releases": false,
            "series_id": "2156",
            "title": "Koukou Tekkenden Tough",
            "tracked": true,
            "unread_releases": []
        };

    return series;
}

function seriesExampleBasic6(){
    var series = 
        {
            "date_added": "",
            "last_update_was_manual": true,
            "mu_user_chapter": "1",
            "mu_user_volume": "1",
            "no_published_releases": false,
            "series_id": "57637",
            "title": "Talking Through Colors",
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