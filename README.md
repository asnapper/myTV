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
```
EPISODE_CALENDAR_FEED_URL # defaults to https://episodecalendar.com/de/rss_feed/matthias.loeffel@gmail.com
RSS_FETCH_INTERVAL # milliseconds, how often we should update rss feed data, defaults to 1*60*1000
TORRENT_SEARCH_INTERVAL # milliseconds, defaults to 1000

EZTV_INTERVAL # milliseconds, delay between requests to EzTV defaults to 1000
EZTV_REJECTION_DELAY # do not modify for now
PIRATEBAY_INTERVAL # milliseconds, delay between requests to thepiratebay.org defaults to 1000
PIRATEBAY_REJECTION_DELAY # do not modify for now
```
make sure you configure the download volume in ```docker-compose.yml```

## Things left to do
- Serialize/Deserialize episode data to/from JSON file
- Graceful shutdown
- Serialize on shutdown
- Send magnet links only once to transmission daemon
- Unclutter main.js
- Optimize ease of use
