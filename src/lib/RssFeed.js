import FeedParser  from 'feedparser'
import request from 'request'
import { Observable } from './Observable'

export class RssFeed extends Observable {

    constructor(url) {
        super()
        this.url = url
        const feed = this
        this.feedparser = new FeedParser()

        this.feedparser.on('readable', function () {
            const stream = this
            let item
            while (item = stream.read()) {
                feed.notifyObserver(item)
            }
        })
    }

    fetch () {
        const feed = this
        const req = request(this.url)

        req.on('response', function (res) {
            const stream = this

            if (res.statusCode === 200) {
                stream.pipe(feed.feedparser);
            }
        })
    }
}