import { setInterval } from 'timers';
import Transmission from 'transmission'

import { EpisodeCalendarFeed } from './lib/EpisodeCalendarFeed'
import { TorrentSearch } from './lib/search/TorrentSearch'
import { EzTVProvider } from './lib/search/providers/EzTVProvider'
import { PirateBayProvider } from './lib/search/providers/PirateBayProvider'

const EPISODE_CALENDAR_FEED_URL = process.env.EPISODE_CALENDAR_FEED_URL || 'https://episodecalendar.com/de/rss_feed/matthias.loeffel@gmail.com'

function main() {
    const transmission = new Transmission({
        host: 'transmission',
        port: 9091,
        //username: 'username',
        //password: 'password',
        ssl: false,
        url: '/transmission/rpc'
    })
      

    const search = new TorrentSearch([new EzTVProvider, new PirateBayProvider])
    const calendar = new EpisodeCalendarFeed(EPISODE_CALENDAR_FEED_URL)
    const episodes = []

    calendar.subscribe((episode) => {
        if (!episodes.filter(ep => ep.show === episode.show && ep.seasonNumber === episode.seasonNumber && ep.episodeNumber === episode.episodeNumber).length) {
            episodes.push(episode)
        }
        
    })

    setInterval(() => calendar.fetch(), process.env.RSS_FETCH_INTERVAL || 1 * 60 * 1000)
    setInterval(() => {
        episodes.filter(episode => !episode.processing && !episode.magnetLink)
            .forEach(episode => {
                episode.processing = true
                search.search(`${episode}`)
                    .then(magnetLink => {
                        episode.processing = false
                        episode.magnetLink = magnetLink
                        return episode
                    })
                    .then(episode => {
                        transmission.addUrl(episode.magnetLink, (err, arg) => {
                            if (err) {
                                console.log(err)
                                return err
                            } else {
                                console.log(`successfully added ${episode}`)
                            }
                        });
                    })
                    .catch(error => episode.processing = false)
            })
        
    }, process.env.TORRENT_SEARCH_INTERVAL || 1000)
    calendar.fetch()
}

main()