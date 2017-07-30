
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

function seriesTitlesArray1000() {
	return ["Aleph Code", "All You Need Is Kill", "An Honest Bargain", "An Honor-Roll Member at the Magic Academy", "Arabian Porno", "Din No Monshou (Novel)", "Elf-san wa Yaserarenai.",
		"Eliza (Novel)", "Eto Royale", "Everyday Life in This Wonderful World!", "EXIT_", "Fate/Extra CCC - Foxtail", "Fate/Grand Order dj - Love That Leads To The Abyss", "Flowers Falling Together",
		"Fumi-chan no Kyuushokubukuro", "Fushigi no Kuni no Bird", "Gakkou Gurashi!", "Golden Kamui", "H", "H × Koi × Haji 2", "H (AMANO Ameno)", "H (KINJOUJI Tama)", "H (YAMAOKA Kotetsuro)",
		"H + P", "H - Love Talk", "H Beam", "H Breeder", "H Chaunen!", "H Comic Goddess", "H Connection", "H Danketsu", "H Datte Ii ja Nai", "H de Chu", "H de Gomen ne", "H de Gomennasai",
		"H de Kirei ni Natte Yaru!", "H ing", "H Jigyoubu Eigyou Ni Ka", "H Kei Onna no Ko", "H Kinshi de Koi Kurabe", "H Liife!", "H Milk", "H Mode wa Bakunyuukei", "H Muchume", "H na", "H na Benkyou Shimasho",
		"H na Girls", "H na H to A Ko no Noroi", "H na Happyoukai", "H na Hitozuma - Yoridori Furin Mansion", "H na Hon wa Shuusei Shichau zo ~tsu", "H na Karadatte Iwanaide",
		"H na Koakuma-kun wa Nugase Jouzu de, Yajuu Sugi!", "Hachimitsu ni Hatsukoi", "Hadaka no Joou-sama", "Hadaka no Joou-sama - Roshutsu de Dokidoki", "Hadaka no Junai", "Hadaka no Koibito",
		"Hadaka no Koishi yo?", "Hadaka no Kusuriyubi", "Hadaka no Makyou", "Hadaka no Ningyou", "Hadaka no Oji-sama", "Hadaka no Oku-sama", "Hadaka no Omiai Gasshuku", "Hadaka no Otoko",
		"Hadaka no Ou-sama", "Hadaka no Ou-sama (AOKI Sou)", "Hadaka no Ou-sama (HAKO Tomoko)", "Hadaka no Ou-sama (KAZUHASHI Tomo)", "Hadaka no Ou-sama (KOGA Saburo)", "Hadaka no Ouji-sama",
		"Hadaka no Ouji-sama (MIYUKI Mitsubachi)", "Hadaka no Ouji-sama (NAGAIKE Tomoko)", "Hadaka no Ouji-sama - Love Kingdom", "Hadaka no Ringo", "Hadaka no Rirekisho", "Hadaka no Sensei",
		"Hadaka no Shinjitsu", "Hadaka no Shitsudo", "Hadaka no Shougun!", "Hadaka no Shounen", "Hadaka no Shounen (Hindenburg)", "Hadaka no Taiyou", "Hadaka no Tsukiai", "Hadaka Pet no Arbeit",
		"Hadaka Samurai", "Hadaka Yori Hiwai", "Hadakana", "Hadakanbo", "Hadakanbo (MAKI Daikichi)", "Hadakanbo Paradaisu", "Hadakaniwanaranai", "Hadashi de Bara o Fume", "Hadashi de Kiss",
		"Hadashi de Last Dance", "Hadashi de Osanpo", "Hadashi de Waltz wo", "Hadashi Meguri", "Hadashi no Aitsu", "Hadashi no Bun", "Hadashi no Chimera", "Hadashi no Cinderella", "Hadashi no Gen",
		"Hadashi no Hanayome", "Hadashi no Lolita", "Hadashi no Mademoiselle", "Hadashi no Mama no Michikusa", "Hadashi no Mei", "Hadashi no Muse", "Hadashi no Okuman Chouja", "Hadashi no Oujo Marietta",
		"Hadashi no Princess", "Hadashi no Princess (WAKAMATSU Natsuki)", "Hadashi no Seishun", "Hadashi no shinwa", "Hadashi no Suki na Hito", "Hadashi no Super Girl", "Hadashi no Tenshi", "Hadashi no Waltz",
		"Hade Hendricks Monogatari", "Hades", "Hades Island", "Hades of Lewd Flower", "Hades Project Zeorymer", "Hades Project Zeorymer Omega", "Hadeschool", "Hadi Girl", "Hadou", "Hadou Haruka Nari Nobunaga",
		"Hadou no Mon", "Hadou Sousai! Fukujuu Shinai to......", "Haduki Kaoru no Tamaranai Hanashi", "Haduki's Girl Friend", "Hae! Bun Bun", "Haedo Joa!", "Haengunui Bulcheonggaek", "Hakoniwa no Soleil",
		"Hakushaku to Yousei (Novel)", "Hammer Session!", "Hamster no Kenkyuu Report", "Hana to Junketsu", "Haru x Kiyo", "Heavenly Match", "Hidan no Aria", "Hinomaru-Zumou", "History's Strongest Senior Brother (Novel)",
		"I am the Monarch (Novel)", "I Leveled up from Being a Parasite, But I May Have Grown Too Much (Novel)", "I, am Playing the Role of the Older Brother in Hearthrob Love Revolution (Novel)",
		"In a Different World With the Naruto System (Novel)", "Infinity Armament (Novel)", "iShoujo", "Jigoro!", "Journey to Seek Past Reincarnations", "Jubei Yagyu Dies", "Kami-sama no Ekohiiki",
		"Karate Shoukoushi Kohinata Minoru", "Kekkonshite mo Koishiteru", "Kenshi o Mezashite Nyugaku Shitanoni Maho Tekisei 9999 Nandesukedo!? (Novel)", "Kento Ankokuden Cestvs", "Kimetsu no Yaiba",
		"King of Hell", "King of Idol", "King of the Ants", "Kiss x Death", "Koi Inu", "Komi-san wa Komyushou Desu.", "Koukou Tekkenden Tough", "Lottery Grand Prize: Musou Harem Rights (Novel)", "Mad Bull 34",
		"Madame Petit", "Made in Abyss", "Magi", "Magi Craft Meister (Novel)", "Magician (KIM Sarae)", "Mai Ball!", "Manga wo Yomeru Ore ga Sekai Saikyou (Novel)", "Martial God Asura (Novel)", "Martial God Space (Novel)",
		"Martial World (Novel)", "Master of the Stars (Novel)", "Midnight Make Love", "Mill", "Minato Machi Neko Machi", "Mo Tian Ji (Novel)", "Mousou Telepathy", "Muchuu no Hito", "Mudazumo Naki Kaikaku",
		"Murabito desu ga Nani ka?", "My High-Spec Darling", "My Wife Is a Beautiful CEO (Novel)", "Namaikizakari", "Nanatsu no Taizai", "Nanohana no kare", "Nekomata.", "Nice Guy Syndrome", "Noblesse", "Normal Class 8",
		"Oh! Holy", "Omakase! Peace Denkiten", "Omoi, Omoware, Furi, Furare", "Online Game: Evil Dragon Against The Heaven (Novel)", "Ookami Heika no Hanayome", "Ore Yome. - Ore no Yome ni Nare yo", "Orpheus no Mado",
		"Otaku's Offspring", "Otherworldly Evil Monarch (Novel)", "Otoko Nara Ikkokuichijou no Aruji o Mezasa Nakya ne (Novel)", "Ouke no Monshou", "Path to Heaven (Novel)", "Peerless Martial God (Novel)",
		"Perfect World (Novel)", "Plundering the Heavens (Novel)", "Poison Genius Consort (Novel)", "Poisoning the World (Novel)", "Pokemon dj - Festival of Champions", "Premarital Relationship",
		"Primordial Blood Throne (Novel)", "Princess Medical Doctor (Novel)", "Prodigiously Amazing Weaponsmith (Novel)", "Pupa", "Pure Love x Insult Complex (Novel)", "Quan Zhi Gao Shou", "Quan Zhi Gao Shou (Novel)",
		"Tabi Bon", "Tabi Dayori", "Tabi Man", "Tabi ni Deyou, Horobiyuku Sekai no Hate Made (Novel)", "Tabi ni Kakemashou", "Tabi no Haji wa Kakisute", "Tabi no Hata", "Tabi no Shiori", "Tabi no Tochuu",
		"Tabi no Une Une", "Tabi no Utautai", "Tabi Pon", "Tabi to Michidure", "Tabi x Onna = OB", "Tabi Yume Kibun", "Tabi-to", "Tabibito", "Tabibito no Jidai", "Tabibito no Ki", "Tabibito no Ki (FUJIO Nami)",
		"Tabibito-kun", "Tabidachi Napoleon", "Tabidachi no Asa", "Tabidachi no Big Wave", "Tabidachi no Hi", "Tabidachi no Venechia", "Tabidachi wa Kaze no you ni", "Tabidachi wa Koi no Hajimari", "Tabidate! Hirarin",
		"Tabidate! Jr.", "Tabie!", "Tabiji no Hate ni", "Tabimichi", "Tabiru Dake!", "Tabisaki no Koi", "Tabishi Kawaran!!", "Tabishitara Toufu Mental na Oru Kana?", "Tabisuru Can Coffee", "Tabitabi Ajia",
		"Table for Two", "Table of Nagami Family", "Table of Tales", "Table Tennis and Hard Rock and I.", "Table Tennis of Ageha", "Tableau Gate", "Tableau Gate 0", "Tableau Numéro 20", "Taboo", "Taboo (MIYAMOTO Rumi)",
		"Taboo (MOMONARI Taka)", "Taboo (SAKABE Shuuichi)", "Taboo (YAHAGI Takako)", "Taboo - Ikenai Renai", "Taboo Charming Mother", "Taboo District (Official English Title)", "Taboo ja Nai Mon!", "Taboo Lust",
		"Taboo ni Daite", "Taboo no Taion", "Taboo Science", "Taboo Tattoo", "taboo×secret", "Tabuchi-kun - Warashi no Baseball", "Tabun Ai Darou", "Tabun All Right", "Tabun Bara-iro no Jinsei", "Tabun Kitto Aishiteru",
		"Tabun Koi no Hanashi", "Tabun Motto Suki ni Naru", "Tabun Sore ga Love Nanjanakarou ka", "Tabun Wakusei", "Taburakashi", "Tac Tic...s", "Tacchi de Ikuze! Takeda-kun", "Tachi Back de ne",
		"Tachi Masshigura - Neko Cafe Yuri Goudou", "Tachiagare! Orc-san", "Tachibana Kiku no Amaeta Kankei", "Tachibana Mitsuko no Kyouikuteki Shidou", "Tachibana Tantei Jimusho", "Tachibana-kun no Mukashi no Hanashi",
		"Tachibana-san's Circumstances With a Man", "Tachibana-sanchi no Nichiyoubi", "Tachibanakan -ToLie- Triangle", "Tachibanakan Ce Leb Life", "Tachibanake no Himejou", "Tachibanaya Hanjouki",
		"Tachibanaya no Hime Jijou", "Tachigare no Mori", "Tachiiri Kinshi Love", "Tachiiri Kinshi no Ecchi Kichi", "Tachikawa Domari Love Hotel", "Tachikomeru Bara no Kaori", "Tachippana!", "Tachiyomi Kinshi!",
		"Tachiyomi Senyou", "Tachu Maru", "Tachyon F!nk", "Tackey & Tsubasa dj - Fiesta de Venus", "Tackle", "Tackle Beat", "Tackle Girl", "Tact", "Tactical Mama", "Tactics", "Tactics dj - Haru no Kuni",
		"Tactics dj - Kan-chan Became a Kitty", "Tactics dj - Lost Butterfly", "Tactics dj - Love Sick", "Tactics dj - Mutual Love", "Tactics dj - Shisshou Hour", "Tactics for Square Love", "Tactics Ogre",
		"Tactics Train (French)", "TAD", "Tada Ai no Tame ni", "Tada Ai Yue ni", "Tada Hitotsu no Ai o Mitsumete", "Tada Ichinodake no Eien", "Tada Ima Assist Boshuuchuu!", "Tada Kaoru Jisen Kessakushuu",
		"Tada Kaoru: The Best", "Tada Koishikute, Aitakute...", "Tada Massugu ni Anata e", "Tada Massugu ni Kimi o Omou", "Tada Mono ja Nai Yatsura-tachi!", "Tada Soba ni Ite Dakishimete", "Tada Yori Takai Mono wa Nai",
		"Tada Zutto Negatteru", "Tada's Do-It-All House", "Tada, Kimi no Soba ni Iru Dake de", "Tada, Kimi o Aishiteru", "Tadaima", "Tadaima '69", "Tadaima \"Kakure Hitomishiri\" ga Heisei o Yosotte Seikatsushite Orimasu",
		"Tadaima Benkyouchuu", "Tadaima Dokushinchuu", "Tadaima Full House", "Tadaima Gaishouchuu", "Tadaima J&#363;gy&#333;-ch&#363;!", "Tadaima Junbichuu", "Tadaima Kinmuchuu", "Tadaima Kiseichuu",
		"Tadaima Koi no Make-chuu", "Tadaima Manshitsu!!", "Tadaima Ninshinchuu!", "Tadaima no Kiroku 2 Fun 20 Byou 5", "Tadaima no Uta", "Tadaima Pool Seisouchuu", "Tadaima Renai Kenshuuchuu",
		"Tadaima Sanjou! Yatterman", "Tadaima Sensei!", "Tadaima Shinryakuchu!", "Tadaima Shoujouchuu ni Tsuki!", "Tadaima Shugyouchuu", "Tadaima!", "Tadaima!!", "Tadaima, Okaeri", "Tadaima, Okaeri dj - Oni Taiji!",
		"Tadaima, Ouji Seizouchuu!", "Tadaima.", "Tadakoro &#12373;~&#12435;!", "Tadamono da", "Tadare En", "Tadareta Boshi no Himitsu", "Tadashi Ikemen ni Kagiru", "Tadashi Koi no Erabikata",
		"Tadashi Nijigen ni Kagiru", "Tadashi, Wake Ari", "Tadashii Ace no Kouryakuhou", "Tadashii Danshi no Kyourenhou", "Tadashii Geboku no Tsukaikata", "Tadashii Hentai Seiyoku", "Tadashii Hitsuji",
		"Tadashii Hoshi no Miagekata", "Tadashii Imouto no Shitsuke Kata", "Tadashii Inu no Shitsuke kata", "Tadashii Kagaijugyou", "Tadashii kamo Shirenai Danjo Kousai no Arikata", "Tadashii Kanojo no Aishikata",
		"Tadashii Kekkon Aite", "Tadashii Kodomo no Shikarikata", "Tadashii Kodomo no Tsukuri kata!", "Tadashii Kokka no Sourikata", "Tadashii Majutsu no Asobikata", "Tadashii Musuko no Sodatekata",
		"Tadashii Otoko no Shitsukekata", "Tadashii Pill no Nomikata", "Tadashii Reijou no Sodatekata", "Tadashii Renai no Susume", "Tadashii Seikyouiku.", "Tadashii Senpai no no Otoshikata", "Tadashii Sensou",
		"Tadashii Shujyukankei", "Tadashii Skirt no Tsukaikata", "Tadashii Tadzuna no Nigirikata", "Tadashii Uma no Shitsukekata", "Tadashii Yajuu no Shitsuke Kata", "Tadashii Yajuu no Shitsukekata",
		"Tadashikunai Ren'ai no Susume", "Tadasuke Nikki", "Tadatada Daydream Believer", "Tadayo Edo Shizu made", "Tadayoedo Shizumazu, Saredo Naki mo Sezu", "Tadayou Rei ga Anata no Mawari ni Iru!!",
		"Tade Kare! - Tade Kuu Kare mo Sukizuki", "Tade Kuu Kanojo", "Tadokoro", "Tadoritsui Ai", "Tadoritsuitara Itsumo Aoizora", "Tadoru Yubi", "Tae Guk", "Tae Jae", "Taekwondar Park", "Taepi Happy",
		"Taeyang-ui Achim, Dal-ui Gasi", "Tafunesu Daichi", "Tag", "TAG (SUEHIRO Gari)", "Tag (TANIMURA Marika)", "Tag Up", "Tag X (German)", "Tag! You're it", "Tagai no Guardian", "Tagame Gengorou [Kindan] Sakuhinshuu",
		"Tagatame", "Tagayashite Fall in Love", "Taheruana Tomiko", "Tahichi Girl", "Tahitian Wedding", "Tahlequah", "Tai Isuwari Nikki", "Tai Shang Tai Xia", "Tai Xuan Zhan Ji", "Tai Zi Ye", "Tai....kyoo",
		"Taian Kichinichi", "Taian Q Hi", "Taiatari Shinkenkousai", "Taichiro of the Flowers", "Taida Neenee", "Taidana Dragon wa Hatarakimono (Novel)", "Taif&#363; no Hi", "Taifuu Gorou", "Taifuu Tokidoki Zonbi",
		"Taiga Drama Yoshitsune", "Taiga no Pantsu", "Taiga of Genesis", "Taigaa Masuku", "Taigan no Kanojo", "Taiganjouju Komomo Desho!", "Taihei Genji: Kuroi Kuroi Tani", "Taihei Tengoku Engi", "Taiheiki",
		"Taiheiki (SAITO Takao)", "Taiheiyou no Bujin", "Taiheiyou X Point", "Taihen desu Gohan-san Onnanoko ni Nacchai Mashita.", "Taihen Furyouku (Waruku) Dekimashira", "Taihen Hentai", "Taihen Kawaiku Dekimashita",
		"Taihen Lupo Lighter", "Taihen Moiji-chan", "Taihen Reporate Writer", "Taihen Yoku Dekimashita", "Taihen Yoku Dekimashita.", "Taihen Yoku Dekimashita?", "Taiho Shichau zo", "Taiho Shichau zo - Second Season",
		"Taiho Shichau zo - The Movie", "Taiho Shite Miina!", "Taihou Era Girls Express", "Taihou to Stamp", "Taiikikaikei Oshiegogui", "Taiiku Kyoushi", "Taiiku no Jikan", "Taiiku Souko nite, Haha, Ai no Shigoki",
		"Taiiku Souko no Feti O kun", "Taiiku Souko no Kokuhaku", "Taiikusai wa Dangerous", "Taiji Ihen - Watashi no Aka-chan", "Taijin ga Shiranai Kodomo no Kuni", "Taijin no Shiranai Sekai",
		"Taiju - Kengou Shogun Yoshiteru", "Taikai ni Hoyu", "Taikai no Senshi Tuna-Man!", "Taikan à la carte", "Taikan Ondo Plus", "Taikan Performance", "Taikei Slider o Ijittetara Are ga Haechatta Ohanashi", "Taiken",
		"Taiken Mizugi Kurabu", "Taiyou no Nakamatachi yo - Shintai Shougaisha to Aru Ishi Chousen", "Taiyou no Natsuyasumi", "Taiyou no Romance", "Taiyou no Senshi Pokapoka", "Taiyou no Shita de Matteru",
		"Taiyou no Shita de Warae", "Taiyou no Shita no 17 sai", "Taiyou no Shita, Te o Tsunaide...", "Taiyou no Shizuku", "Taiyou no Shoujo Inca-chan", "Taiyou no Tenohira", "Taiyou no Uta",
		"Taiyou no Uta (MIKIMOTO Rin)", "Taiyou no Viola", "Taiyou no Yuki", "Taiyou o Machinagara", "Taiyou o Otoshita Otoko", "Taiyou Ouji", "Taiyou Shijinki", "Taiyou Shounen Django", "Taiyou to Getsujin",
		"Taiyou to Kaze no Sakamichi", "Taiyou to Koishite", "Taiyou to Shiosai to", "Taiyou to Tsuki no Aida de", "Taiyou to Tsuki no Aida de (SARASHINA Mizuho)", "Taiyou to Tsuki no Ingaritsu",
		"Taiyou to Yuki no Kakera", "Taiyou wa Kimi ni Kagayaku", "Taiyou wa Tsumi na Yakko", "Taiyou Yori Atsui Hoshi", "Taiyou-kun no Junan", "Taizo Mote King Saga", "Taizou Mote King Saga dj - Moteou Book",
		"Taj Mahal Byou no Aru Machi", "Tajikarao", "Tajjii Majjii", "Tajomaru", "Tajuu Jinkaku Kanojo - Shiranai Kizuato", "Tajuu Jinkaku Tantei Psychoco", "Tajuu Jinkaku Tantei Saiko", "Taka", "Taka (AKIMOTO Nami)",
		"Taka ga Fukuen", "Taka ga Koi daro", "Taka no Tsume Yoshida-kun no Batten File", "Taka to Tonbi to Aburaage", "Taka wo Kukurouka", "Taka-chan and Yama-chan", "Takadai-ke no Hitobito",
		"Takaga Kekkon Saredo Kekkon", "Takaga Sennen", "Takahara Naoshiro Monogatari", "Takahashi is hearing it.", "Takahashi Miyuki Selection", "Takahashi Rumiko Gekijou", "Takahashi Rumiko Kessaku Tanpenshuu",
		"Takahashi Rumiko Kessakushu", "Takahashi Saemi Tanpenshuu", "Takahashi Seiichi no Yoiko no SF Gekijou", "Takahashi-gumi no Zanteikyuu Ikimassu!!", "Takahashi-kun Daimondai", "Takahashi-kun Yuujuufudan",
		"Takakazu no Ahiru no Ko Monogatari", "Takako", "Takako no Michishirube", "Takakura-n-chi Mou Hitosara", "Takama-ga-hara", "Takamanohara ni Kamudu Marimasu", "Taken by the Sheikh",
		"Taken Over by the Billionaire", "Takenoko Gakuen - Leotard Mousoudan", "Takeo-chan Bukkairoku", "Takeout", "Takeout Honey", "Takeru", "Takeru (NAKASHIMA Kazuki)", "Takeru Hime", "Takeru Michi",
		"Takeru no Chikai", "Takeshi no Saikyo Meshi!", "Takeshi-kun no Junjou", "Takete ageru&#9834;", "Taketomi Tomo Tanpenshu", "Taketori Fantasia", "Taketori Monogatari", "Taketori Overnight Sensation",
		"Takeuchi Sakura Short Stories", "Takeyabu Yaketa", "Takeyama's Life", "Taki Takanosuke no Sanpo Jikan", "Takianna no Honshou wa S na no ka M na no ka Ore Dake ga Shitte Iru.", "Takidani High Manga Club",
		"Taking a Walk", "Taking Action When Your Little Sister Sees You Doing “H” By Yourself", "Taking back the Princess in the Different World",
		"Taking Buddy's Wife", "Taking Care of a Dog", "Taking Home", "Taking It All", "Taking My Time with You", "Taking Onee-chan's Hand", "Taking Shelter", "Taking Shelter from the Rain",
		"Taking Shelter from the Rain (Arai Kei)", "Taking the Perfect Husband Home: With 55 Stolen Kisses", "Takinou Kaden Musume Hatsubaichuu!", "Takita Yuu Rakugo Gekijou",
		"Takitate Gakuen Dosukoi-bu - Mawashi no Shita ha Mattanashi!", "Takitate Gohan ga Tabetai no!", "Takiyakiman Story", "Takizawa Romanesque Hiny", "Takkoku!!!",
		"Takkun and Stalker Boy - I Ate Takkun's Used Tissue Today", "Takkun ni Koi Shiteru!", "Takkyuu Dash!!", "Takkyuu Lipton", "Takkyuu Sentai Pinpon 5", "Takkyuu Shachou", "Taklamakan Doubutsuen",
		"Tako Yaki Princess", "Tako-chan", "Tako-chan no Seishun Shubi Dubada: Kaigai Nichijouhen", "Takopon", "Takosan Wiener no Nazo", "Takoyaki Hokahoka", "Takoyaki Tsuushin", "Taku no ko", "Taku-chan",
		"Taku-san Agechae!", "Taku-san Taberu Kimi ga Suki", "Takuan and Batsu's Daily Demon Diary", "Takuan no Shippo", "Takuan Oshou", "Takubou no Mainichi", "Takuhai Bin-chan", "Tales of the Abyss Comic Anthology",
		"Tales of the Abyss dj - 02", "Tales of the Abyss dj - 30%", "Tales of the Abyss dj - A Requiem For My Most Beloved You", "Tales of the Abyss dj - Affair in the Rain", "Tales of the Abyss dj - Aka Shiro",
		"Tales of the Abyss dj - Akai noni Shiroi no.", "Tales of the Abyss dj - Algorithm Rondo", "Tales of the Abyss dj - An Imaginary Tale of Guy's Betrayal", "Tales of the Abyss dj - Anata to Watashi no Chiwagenka",
		"Tales of the Abyss dj - Ash Princess", "Tales of the Abyss dj - Avenger", "Tales of the Abyss dj - Basha no Naka.", "Tales of the Abyss dj - Before We Say Good Night", "Tales of the Abyss dj - Bird of Passage",
		"Tales of the Abyss dj - Bokura", "Tales of the Abyss dj - Ca revient au meme", "Tales of the Abyss dj - Canary Box", "Tales of the Abyss dj - Cavok", "Tales of the Abyss dj - chains + hands",
		"Tales of the Abyss dj - Change", "Tales of the Abyss dj - Conflict", "Tales of the Abyss dj - Couronne*", "Tales of the Abyss dj - Crimson", "Tales of the Abyss dj - Daichi to Kimi to Kimi no Tokeru Karada",
		"Tales of the Abyss dj - Dolce", "Tales of the Abyss dj - Dr. Jade ni Kiitemite!", "Tales of the Abyss dj - Drunks", "Tales of the Abyss dj - Elder Sister",
		"Tales of the Abyss dj - Emergency Approach to Force a Majeure", "Tales of the Abyss dj - Fade", "Tales of the Abyss dj - Fear", "Tales of the Abyss dj - G.o.a.p", "Tales of the Abyss dj - Gakuen Days First Days",
		"Tales of the Abyss dj - Great Tear Breasts", "Tales of the Abyss dj - Hachimitsu Butter Drop", "Tales of the Abyss dj - Himatsubushi", "Tales of the Abyss dj - Hinata no Hoshi",
		"Tales of the Abyss dj - Homura no Kimi Tasokare ha", "Tales of the Abyss dj - Hoshi Furu Yoru no Serenade", "Tales of the Abyss dj - I Love You", "Tales of the Abyss dj - Imagined Fairytale",
		"Tales of the Abyss dj - Innocence", "Tales of the Abyss DJ - Innocent Mesiah", "Tales of the Abyss dj - Isoide Heaven", "Tales of the Abyss dj - Jack in the Box", "Tales of the Abyss dj - Joker Joe",
		"Tales of the Abyss dj - Journey's End", "Tales of the Abyss dj - Kanata no Hikari Kagayaite", "Tales of the Abyss dj - Kanzen Douittai", "Tales of the Abyss dj - Key of the Kingdom",
		"Tales of the Abyss dj - Kimi Furu Yuugure", "Tales of the Abyss dj - Kiss in the Dark", "Tales of the Abyss dj - Kostnice", "Tales of the Abyss dj - La Campanella", "Tales of the Abyss dj - La Preuve",
		"Tales of the Abyss dj - Last Distance", "Tales of the Abyss dj - Lay", "Tales of the Abyss dj - Little Days", "Tales of the Abyss dj - Luke in Wonderland", "Tales of the Abyss dj - Luke Luke Shoukougun",
		"Tales of the Abyss dj - Melon Melon", "Tales of the Abyss dj - MELON ni Kubittake Shoshuuhen Jyou", "Tales of the Abyss dj - Meshimase Miso Parfait", "Tales of the Abyss dj - Near to the Boundary of Sky",
		"Tales of the Abyss dj - Nocturne", "Tales of the Abyss dj - Pastoral", "Tales of the Abyss dj - Phony Phonic", "Tales of the Abyss dj - Predation", "Tales of the Abyss dj - Promised Land",
		"Talking That Far Ahead", "Talking Through Colors", "Talking To Your Fingertips", "Talking&#12503;&#12521;&#12493;&#12483;&#12488;", "Tall and Short", "Tall Noichi and Short Hinayuki", "Tall Plus Short",
		"Tall, dark and dangerous", "Tall, Dark And Texan", "Tallie's Knight", "Talwar", "Talysia", "Tam Qu&#7889;c Chí", "Tam Qu&#7889;c Chí: H&#7891;i k&#7871;t", "Tama", "Tama & Hana", "Tama 2 Fortune",
		"Tama Chiru Tsurugi - Banda no Sakura", "Tama Fechi!!", "Tama from Third Street", "Tama ga Suki!!", "Tama Gokko", "Tama Hagane", "Tama Hime-sama", "Tama Hiyo!", "Tama Kick", "Tama ni Hi wo Tsukero",
		"Tama ni Onegai!", "Tama ni wa Ii Koto", "Tama ni wa Muteki Shiyou", "Tama No H Na Mousou Flag", "Tama no Koshi ga Ii no", "Tama no Koshi Shikkaku!?", "Tama no Koshikake", "Tama River", "Tama Sensei ni Kike!",
		"Tama Tama", "Tama Tama Otome", "Tama Tama! Kingyo Sou", "Tama to Tama to", "Tama Yori Hayaku!!", "Tama Yura Douji", "TAMA*PRE", "Tama-chan", "Tama-chan House", "Tama-chan to Chibimaru", "Tama-chan!!",
		"Tama-Hime", "Tama-Hime Ultima", "Tama-san", "Tamachi Kachou no Hi-mi-tsu", "Tamafuri", "Tamagami", "Tamagawa Tamami no Sugoshikata", "Tamage", "Tamago", "Tamago (MIDORIBANA Yanako)", "Tamago Enikki",
		"Tamago Nama", "Tamago no Hi", "Tamago no Kimi", "Tamago no Mannaka", "Tamago Tamago", "Tamago-san", "Tamagokake Gohan", "Tamahime (Anthology)", "Tamahime Soushi", "Tamahime-sama", "Tamahiyo", "Tamaki",
		"Tamaki Toyohiro-kun Satsujin Jiken", "Tamako Market dj - A Shot Through the Heart", "Tamako Market dj - Chibikko Market", "Tamako Market dj - Lovely Girls' Lily", "Tamako Market dj - Mochi-mochi Anko chan",
		"Tamako no Maishuu BBQ!", "Tamako no Seikatsu", "Tang Yin In Another realm", "Tange Sazen", "Tange Sazen (OZAWA Satoru)", "Tangerine Treacle", "Tangisan Kura-Kura", "Tangle of Torment", "Tangled",
		"Tangled Emotions", "Tangled Sheets", "Tango", "Tango (French)", "Tango EXP.", "Tango no Otoko", "Tani-kitsu", "Taniai no Lily", "Taniguchi Jiro Kessakushu", "Tanikamen", "Tanikawa Bekkan", "Taniku-chan",
		"Tanima de Obenkyo", "Tanima Refresh", "Tanimura Hitoshi no Bakuretsu Kouryaku Battle 2003", "Tanimura Hitoshi to Katsu!!", "Tanimura no Pachinko Cult Bakushoujuku", "Tanin Donburi", "Tanin Doushi",
		"Tanin Doushi (INOUE Youko)", "Tanin Kurashi", "Tanin no Ie", "Tanin no Kankei", "Tanin no Ketten", "Tanin no Ore", "Tanisoko Lion", "Tanizaki Mangekyo - Tanikazi Junichiro Manga Anthology", "Tanjou",
		"Tanjou (OKANO Hajime)", "Tanjou!", "Tanjoubi ga Ippai", "Tanjoubi ni Korosareru", "Tanjun?&#8592;&#9829;&#8594;Fukuzatsu?", "Tank Tankuro", "Tanka", "Tanka on Studying Overseas", "Tanken Driland",
		"Tanken Driland (KONNO Yuuki)", "Tankore", "Tanned Girls Are the Best!", "Tannin Kyoushi no Ikenai&#9829;Houkago", "Tannpopo ni Huru Ame", "Tanomu kara Shizuka ni Shitekure",
		"Tanoshi Neko Gokko", "Tanoshi- sou Tayori", "Tanoshii Apaato Life wo Osugoshi Kudasai", "Tanoshii Asobi", "Tanoshii B Chiku", "Tanoshii Hoken Taiiku", "Tanoshii Jinsei", "Tanoshii Katei no Kyouiku", 
		"Tanoshii Koto Ippai!", "Tanoshii Koto Shimasho", "Tanoshii Koushien", "Tanoshii Natsu no Sugoshi Kata&#9829;", "Tanoshii Omocha", "Tanoshii Rinjin", "Tanoshii Shinsengumi", "Tanoshii Tanoshii Bokura no Nomikai",
		"Tanoshii Youchien", "Tanoshiku na Kayoku Yasashiku ne", "Tanoshiku, Tanoshiku, Ecchi ni ne", "Tanpa Kimi", "Tanpen Manga Shuu: Baniizu Hoka", "Tanpen Renai", "Tanpen Shu Beta", "Tanpenshuu",
		"Tanpenshuu Korekushion", "Tanpo", "Tanpo Potan", "Tanpopo Garden kara", "Tanpopo Hoikuen Kantaman", "Target of Love", "Target of Salandra - MITSUHARA Shin's Collected Short Stories", "Target wa Furikaeru",
		"Target wa Okuman Chouja", "Targeted School Boy", "Tari Tari", "Tari Tari dj - My Favorite Horse", "Tarian Langit (Indonesian)", "Tarin Taran", "Tarinai Jikan", "Tarlna", "Taro", "Taro and Tayura",
		"Taro Densetsu", "Taro is Distorted", "Taro no Ichinchi", "Taro no Kotarou", "Taro the Space Alien", "Taro-kun wa Kou Miete Igai to xxx Desu.", "Tarot Hunt", "Tarot Labyrinth", "Tarot Maiden Kisara",
		"Tarot Master", "Tarot Paradise", "Tarot Shop", "Tarot World", "Tarou ga Machi ni Yattekita", "Tarou Sensei ga Yatte Kita!", "Tarou wa Mizu ni Narita Katta", "Tartaros", "Tartaros Gekijou",
		"Tarte Tatin no Kataomoi", "Tartlet o Hitotsu dake", "Taru no Naka NP Teacher", "Taru Shiba", "TARU-DOL MASTER", "Taruto Mikkusu", "Taruto wa Ika ga?", "Tashigi wa Sogekishu ni Koi o Suru",
		"Tashiro-kun, Kimi tte Yatsu wa", "Tashou Nari Tomo Higenjitsuteki na Seikatsu", "Task", "Tasogare Bus", "Tasogare Butou Kurabu", "Tasogare City Graffiti", "Tasogare Coelacanth", "Tasogare dare",
		"Tasogare Dokushoshitsu", "Tasogare Mangaka Mi-chan no SF desu yo", "Tasogare Memorandum", "Tasogare ni Dancing", "Tasogare ni Matsu Kimi o", "Tasogare ni Ochite", "Tasogare ni Toki o Koete",
		"Tasogare no Cinderella", "Tasogare no Kimi ni Kuchizuke wo", "Tasogare no Mukougawa", "Tasogare no Nikiita-chan", "Tasogare no Nikiita-chan 2010", "Tasogare no Niwa", "Tasogare no Rakuen",
		"Tasogare Otome x Amnesia", "Tasogare Otome x Amnesia dj - Evanescence Maiden", "Tasogare Otome x Amnesia dj - Koi suru Otome Yuuko-san", "Tasogare Otome x Amnesia dj - Tanrei Otome", "Tasogare Renren",
		"Tasogare Ryuuseigun", "Tasogare Ryuuseigun - Best of Best", "Tasogare Sakaba", "Tasogare Schrödinger", "Tasogare Seventeen", "Tasogare Shousetsuka", "Tasogare Takako", "Tasogare Tokete, Kimi ni Somaru",
		"Tasogare wa Karera no Jikan", "Tasogare wa Ouma no Jikan", "Tasogare, Kimi ni Ai ni Iku", "Tasogare-doki Teidan", "Tasogare-iro no Uta Tsukai (Novel)", "Tasogarebashi Ekimae Omokage Shokudou",
		"Tasogaredoki ni Mitsuketa no", "Tasogaredou e Youkoso", "Tasokare no Yume", "Taste", "Taste of a Teacher's Honey", "Taste of Fish", "Taste of Girls", "Taste of Honey", "Taste of Honey (KOJIMA Katsura)",
		"Taste of Love", "Taste of Poison", "Tastes Better With Cream (Official English Title)", "Tasting After Dark", "Tasting of Love only Once", "Tasty Affinity", "Tasuke... te...", "Tasukete Angel",
		"Tasukete Doctor Dokuta", "Tasukete Kaiketsu Kurozukin", "Tasukete! Vampire", "Tasuu Ketsu", "Tatabi- sou wa Neko Yashiki", "Tatakae Atlas", "Tatakae Gunjin- kun", "Tatakae Hitozuma Sensei Keiko- san",
		"Tatakae Kanfuu- doukoukai", "Tatakae Namu", "Tatakae Okusan!! Funinshou Bugi", "Tatakae! Announcer", "Tatakae! Announcer Kakudai Special", "Tatakae! Bishoujo Senshi Shiny Cute",
		"Tatakae! Gotouchi Sentai Aka Ranger!", "Tatakae! Green Beret- kun", "Tatakae! Harumaki", "Tatakae! Honey", "Tatakae! Kinniku Banchou"];
}