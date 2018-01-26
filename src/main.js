import { setInterval } from 'timers';
import Transmission from 'transmission'

import { EpisodeCalendarFeed } from './lib/EpisodeCalendarFeed'
import { TorrentSearch } from './lib/search/TorrentSearch'
import { PROVIDER_MAP } from './lib/search/providers'
import { EPISODE_CALENDAR_FEED_URL, RSS_FETCH_INTERVAL, TORRENT_SEARCH_INTERVAL, TORRENT_PROVIDERS } from './constants'

function main() {
    const transmission = new Transmission({
        host: 'transmission',
        port: 9091,
        //username: 'username',
        //password: 'password',
        ssl: false,
        url: '/transmission/rpc'
    })
      

    const search = new TorrentSearch(TORRENT_PROVIDERS.map(providerName => new PROVIDER_MAP[providerName]))
    const calendar = new EpisodeCalendarFeed(EPISODE_CALENDAR_FEED_URL)
    const episodes = []

    calendar.subscribe((episode) => {
        if (!episodes.filter(ep => ep.show === episode.show && ep.seasonNumber === episode.seasonNumber && ep.episodeNumber === episode.episodeNumber).length) {
            episodes.push(episode)
        }
        
    })

    setInterval(() => calendar.fetch(), RSS_FETCH_INTERVAL)
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
        
    }, TORRENT_SEARCH_INTERVAL)
    calendar.fetch()
}

main()