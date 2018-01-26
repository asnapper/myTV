import { setInterval } from 'timers';
import Transmission from 'transmission'

import { EpisodeCalendarFeed } from './lib/EpisodeCalendarFeed'
import { TorrentSearch } from './lib/search/TorrentSearch'
import { PROVIDER_MAP } from './lib/search/providers'
import { EPISODE_CALENDAR_FEED_URL, RSS_FETCH_INTERVAL, TORRENT_SEARCH_INTERVAL,
    TORRENT_PROVIDERS, TRANSMISSION_HOST, TRANSMISSION_PORT, TRANSMISSION_USER,
    TRANSMISSION_PASSWORD, TRANSMISSION_SSL, TRANSMISSION_URL } from './constants'

const transmission = new Transmission({
    host: TRANSMISSION_HOST,
    port: TRANSMISSION_PORT,
    username: TRANSMISSION_USER,
    password: TRANSMISSION_PASSWORD,
    ssl: TRANSMISSION_SSL,
    url: TRANSMISSION_URL
})

const search = new TorrentSearch(TORRENT_PROVIDERS.map(providerName => new PROVIDER_MAP[providerName]))
const calendar = new EpisodeCalendarFeed(EPISODE_CALENDAR_FEED_URL)
const episodes = []

const unsubscribeCalendar = calendar.subscribe((episode) => {
    if (!episodes.filter(ep => ep.show === episode.show && ep.seasonNumber === episode.seasonNumber && ep.episodeNumber === episode.episodeNumber).length) {
        episodes.push(episode)
    }
})

const rssInterval = setInterval(() => calendar.fetch(), RSS_FETCH_INTERVAL)
const torrentInterval = setInterval(() => {
    episodes.filter(episode => !episode.processing && !episode.magnetLink && !episode.sentToTransmission )
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
                            episode.sentToTransmission = false
                            console.log(err)
                            return err
                        } else {
                            episode.sentToTransmission = true
                            console.log(`successfully added ${episode}`)
                        }
                    });
                })
                .catch(error => episode.processing = false)
        })
    
}, TORRENT_SEARCH_INTERVAL)
calendar.fetch()
