import { EpisodeCalendarFeed } from './lib/EpisodeCalendar'

const EPISODE_CALENDAR_FEED_URL = 'https://episodecalendar.com/de/rss_feed/matthias.loeffel@gmail.com'

function main() {
    const calendar = new EpisodeCalendarFeed(EPISODE_CALENDAR_FEED_URL)
    calendar.subscribe((episode) => {
        console.log(episode)
    })
    calendar.fetch()
}

main()