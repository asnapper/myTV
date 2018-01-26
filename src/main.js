import { setInterval, clearInterval } from 'timers';
import Transmission from 'transmission'

import { EpisodeCalendarFeed } from './lib/EpisodeCalendarFeed'
import { TorrentSearch } from './lib/search/TorrentSearch'
import { PROVIDER_MAP } from './lib/search/providers'
import { episodes, loadEpisodes, saveEpisodes } from './storage'
import { EPISODE_CALENDAR_FEED_URL, RSS_FETCH_INTERVAL, TORRENT_SEARCH_INTERVAL,
    TORRENT_PROVIDERS, TRANSMISSION_HOST, TRANSMISSION_PORT, TRANSMISSION_USER,
    TRANSMISSION_PASSWORD, TRANSMISSION_SSL, TRANSMISSION_URL } from './constants'
import { MESSAGE_INFO_STARTUP, MESSAGE_INFO_TRANSMISSION_CONFIG, MESSAGE_INFO_TRANSMISSION_ADDING,
    MESSAGE_INFO_TRANSMISSION_ADDED, MESSAGE_INFO_SHUTDOWN, MESSAGE_INFO_BYEBYE, MESSAGE_ERROR_TRANSMISSION,
    MESSAGE_ERROR_SHUTDOWN, MESSAGE_INFO_FOUND_EP, MESSAGE_INFO_LOOKUP_EP, MESSAGE_INFO_LOADED, logInfo, logError } from './messages'

const transmissionConfig = {
    host: TRANSMISSION_HOST,
    port: TRANSMISSION_PORT,
    username: TRANSMISSION_USER,
    password: TRANSMISSION_PASSWORD,
    ssl: TRANSMISSION_SSL,
    url: TRANSMISSION_URL
}

logInfo(MESSAGE_INFO_STARTUP)
logInfo(MESSAGE_INFO_TRANSMISSION_CONFIG, transmissionConfig)

loadEpisodes()
logInfo(MESSAGE_INFO_LOADED, episodes.length)

const transmission = new Transmission(transmissionConfig)
const search = new TorrentSearch(TORRENT_PROVIDERS.map(providerName => new PROVIDER_MAP[providerName]))
const calendar = new EpisodeCalendarFeed(EPISODE_CALENDAR_FEED_URL)

const unsubscribeCalendar = calendar.subscribe((episode) => {
    if (!episodes.filter(ep => ep.show === episode.show && ep.seasonNumber === episode.seasonNumber && ep.episodeNumber === episode.episodeNumber).length) {
        logInfo(MESSAGE_INFO_FOUND_EP, `${episode}`)
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
                    logInfo(MESSAGE_INFO_TRANSMISSION_ADDING, `${episode}`)
                    transmission.addUrl(episode.magnetLink, (err, arg) => {
                        if (err) {
                            episode.sentToTransmission = false
                            logError(MESSAGE_ERROR_TRANSMISSION, err)
                            return err
                        } else {
                            episode.sentToTransmission = true
                            logInfo(MESSAGE_INFO_TRANSMISSION_ADDED, `${episode}`)
                        }
                    });
                })
                .catch(error => episode.processing = false)
        })
    
}, TORRENT_SEARCH_INTERVAL)

calendar.fetch()

function dieGracefully(signal) {
    try {
        logInfo(MESSAGE_INFO_SHUTDOWN, signal)
        saveEpisodes()
        search.stop()
        unsubscribeCalendar && unsubscribeCalendar()
        clearInterval(rssInterval)
        clearInterval(torrentInterval)
        logInfo(MESSAGE_INFO_BYEBYE)
        process.exit(0)
    } catch(e) {
        logError(MESSAGE_ERROR_SHUTDOWN, e)
        process.exit(1)
    }
}

process.on('SIGTERM', dieGracefully);
process.on('SIGINT', dieGracefully);