# myTV
Automatic Episode downloader

## Requirements
- recent versions of _docker_ and _docker-compose_ (api version 3 required, might work with older versions with some config tweaks)
- episodecalendar.com account

## Installation
```
docker-compose build
```
## Start
```
docker-compose up
```
## Configuration
configuration is done via docker-compose.yml environment variables

| Environment variable      | Description                       | Default value              |
| ------------------------- | --------------------------------- | -------------------------- |
|EPISODE_CALENDAR_FEED_URL | rss feed url | https://episodecalendar.com/... |
|TORRENT_PROVIDERS | comma separated string with search providers | 'EzTVProvider,PirateBayProvider' |
|RSS_FETCH_INTERVAL | milliseconds, how often to query rss feed | 10 * 60 * 1000 |
|TORRENT_SEARCH_INTERVAL | milliseconds, how often to lookup magnet links | 1000 |
|EZTV_INTERVAL | milliseconds, delay between requests to EzTV | 5 * 1000 |
|EZTV_REJECTION_DELAY | milliseconds, should be long enough so other search providers can return results | 1 * 60 * 1000 |
|PIRATEBAY_INTERVAL | milliseconds, delay between requests to the piratebay | 5 * 1000 |
|PIRATEBAY_REJECTION_DELAY | milliseconds, should be long enough so other search providers can return results | 1 * 60 * 1000 |
|TRANSMISSION_HOST | transmission hostname | 'transmission' |
|TRANSMISSION_PORT | transmission port number | 9091 |
|TRANSMISSION_USER | transmission user | |
|TRANSMISSION_PASSWORD | transmission password | |
|TRANSMISSION_SSL | transmission use ssl | false |
|TRANSMISSION_URL | relative path to transmission rpc endpoint | '/transmission/rpc' |
|STORAGE_PATH | filename of where to store episode data | 'episodes.json' |

make sure you configure the download volume in ```docker-compose.yml```

## Things left to do
- ~~Serialize/Deserialize episode data to/from JSON file~~
- ~~Graceful shutdown~~
- ~~Serialize on shutdown~~
- ~~Send magnet links only once to transmission daemon~~
- ~~Unclutter main.js~~
- Optimize ease of use
- Support more torrent backends (uTorrent)
- Explain usage without docker/docker-compose
