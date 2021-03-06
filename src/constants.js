export const EPISODE_CALENDAR_FEED_URL = process.env.EPISODE_CALENDAR_FEED_URL || 'https://episodecalendar.com/de/rss_feed/matthias.loeffel@gmail.com'
export const TORRENT_PROVIDERS = process.env.TORRENT_PROVIDERS ? process.env.TORRENT_PROVIDERS.split(',') : 'EzTVProvider,PirateBayProvider'.split(',')

export const RSS_FETCH_INTERVAL = process.env.RSS_FETCH_INTERVAL ? parseInt(process.env.RSS_FETCH_INTERVAL, 10) : 10 * 60 * 1000
export const TORRENT_SEARCH_INTERVAL = process.env.TORRENT_SEARCH_INTERVAL ? parseInt(process.env.TORRENT_SEARCH_INTERVAL, 10) : 1000

export const EZTV_INTERVAL = process.env.EZTV_INTERVAL ? parseInt(process.env.EZTV_INTERVAL, 10) : 5 * 1000
export const EZTV_REJECTION_DELAY = process.env.EZTV_REJECTION_DELAY ? parseInt(process.env.EZTV_REJECTION_DELAY, 10) : 1 * 60 * 1000

export const PIRATEBAY_INTERVAL = process.env.PIRATEBAY_INTERVAL ? parseInt(process.env.PIRATEBAY_INTERVAL, 10) : 5 * 1000
export const PIRATEBAY_REJECTION_DELAY = process.env.PIRATEBAY_REJECTION_DELAY ? parseInt(process.env.PIRATEBAY_REJECTION_DELAY, 10) : 1 * 60 * 1000

export const TRANSMISSION_HOST = process.env.TRANSMISSION_HOST ? process.env.TRANSMISSION_HOST : 'transmission'
export const TRANSMISSION_PORT = process.env.TRANSMISSION_PORT ? parseInt(process.env.TRANSMISSION_PORT, 10) : 9091
export const TRANSMISSION_USER = process.env.TRANSMISSION_USER
export const TRANSMISSION_PASSWORD = process.env.TRANSMISSION_PASSWORD
export const TRANSMISSION_SSL = process.env.TRANSMISSION_SSL ? process.env.TRANSMISSION_SSL === 'true' : false
export const TRANSMISSION_URL = process.env.TRANSMISSION_URL || '/transmission/rpc'

export const STORAGE_PATH = process.env.STORAGE_PATH || 'episodes.json'
