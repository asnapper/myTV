import { RssFeed } from './RssFeed'
import { Episode } from './Episode'

export class EpisodeCalendarFeed extends RssFeed {

    notifyObserver(rssData) {
        this.mapper(rssData).forEach(episodeData => super.notifyObserver(episodeData))
    }

    mapper(rssData) {
        let episodes = rssData['rss:episodes'].episode
        episodes = Array.isArray(episodes) ? episodes : [episodes]

        return episodes.map(rssEpisode => {
            return new Episode({
                airDate: new Date(rssEpisode['air_date']['#']),
                show: rssEpisode['show']['#'],
                episodeNumber: rssEpisode['episode_number']['#'],
                seasonNumber: rssEpisode['season_number']['#']
            })
        }).filter(episode => new Date() > episode.airDate)
    }
}