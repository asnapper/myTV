import { EpisodeCalendarFeed } from './lib/EpisodeCalendarFeed'
import { TorrentSearch } from './lib/search/TorrentSearch'
import { EzTVProvider } from './lib/search/providers/EzTVProvider'

const EPISODE_CALENDAR_FEED_URL = process.env.EPISODE_CALENDAR_FEED_URL || 'https://episodecalendar.com/de/rss_feed/matthias.loeffel@gmail.com'

function main() {
    const search = new TorrentSearch([new EzTVProvider])
    const calendar = new EpisodeCalendarFeed(EPISODE_CALENDAR_FEED_URL)

    calendar.subscribe((episode) => {
        search.search(`${episode}`)
            .then(result => console.log(`SUCCESS: ${episode}`, result))
            .catch(error => console.log(`ERROR: ${episode}`, error))
    })
    calendar.fetch()
}

main()