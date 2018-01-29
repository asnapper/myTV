import { setInterval, clearInterval } from 'timers';
import Transmission from 'transmission'

import { EpisodeCalendarFeed } from './lib/EpisodeCalendarFeed'
import { TorrentSearch } from './lib/search/TorrentSearch'
import { PROVIDER_MAP } from './lib/search/providers'
import { episodes, loadEpisodes, saveEpisodes } from './storage'
import * as constants from './constants'
import * as messages from './messages'
import { logInfo, logError } from './messages'

const transmissionConfig = {
    host: constants.TRANSMISSION_HOST,
    port: constants.TRANSMISSION_PORT,
    username: constants.TRANSMISSION_USER,
    password: constants.TRANSMISSION_PASSWORD,
    ssl: constants.TRANSMISSION_SSL,
    url: constants.TRANSMISSION_URL
}

logInfo(messages.MESSAGE_INFO_STARTUP)
logInfo(messages.MESSAGE_INFO_TRANSMISSION_CONFIG, transmissionConfig)

loadEpisodes()
logInfo(messages.MESSAGE_INFO_LOADED, episodes.length)

const transmission = new Transmission(transmissionConfig)
const search = new TorrentSearch(constants.TORRENT_PROVIDERS.map(providerName => new PROVIDER_MAP[providerName]))
const calendar = new EpisodeCalendarFeed(constants.EPISODE_CALENDAR_FEED_URL)

const unsubscribeCalendar = calendar.subscribe((episode) => {
    if (!episodes.filter(ep => ep.show === episode.show && ep.seasonNumber === episode.seasonNumber && ep.episodeNumber === episode.episodeNumber).length) {
        logInfo(messages.MESSAGE_INFO_FOUND_EP, `${episode}`)
        episodes.push(episode)
    }
})

const rssInterval = setInterval(() => calendar.fetch(), constants.RSS_FETCH_INTERVAL)

const torrentInterval = setInterval(() => {
    episodes.filter(episode => !episode.processing && !episode.magnetLink && !episode.sentToTransmission )
        .forEach(episode => {
            episode.processing = true
            search.search([`${episode}`, episode.toString(true)])
                .then(magnetLink => {
                    episode.processing = false
                    episode.magnetLink = magnetLink
                    return episode
                })
                .then(episode => {
                    logInfo(messages.MESSAGE_INFO_TRANSMISSION_ADDING, `${episode}`)
                    transmission.addUrl(episode.magnetLink, (err, arg) => {
                        if (err) {
                            episode.sentToTransmission = false
                            logError(messages.MESSAGE_ERROR_TRANSMISSION, err)
                            return err
                        } else {
                            episode.sentToTransmission = true
                            logInfo(messages.MESSAGE_INFO_TRANSMISSION_ADDED, `${episode}`)
                        }
                    });
                })
                .catch(error => episode.processing = false)
        })
    
}, constants.TORRENT_SEARCH_INTERVAL)

calendar.fetch()

function dieGracefully(signal) {
    try {
        logInfo(messages.MESSAGE_INFO_SHUTDOWN, signal)
        saveEpisodes()
        search.stop()
        unsubscribeCalendar && unsubscribeCalendar()
        clearInterval(rssInterval)
        clearInterval(torrentInterval)
        logInfo(messages.MESSAGE_INFO_BYEBYE)
        process.exit(0)
    } catch (e) {
        logError(messages.MESSAGE_ERROR_SHUTDOWN, e)
        process.exit(1)
    }
}

process.on('SIGTERM', dieGracefully)
process.on('SIGINT', dieGracefully)
