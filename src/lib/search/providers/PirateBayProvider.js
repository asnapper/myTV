import request from 'request'
import cheerio from 'cheerio'
import { clearInterval, setInterval } from 'timers';
import { PIRATEBAY_INTERVAL, PIRATEBAY_REJECTION_DELAY } from '../../../constants'

export class PirateBayProvider {
    constructor(intervalTime = PIRATEBAY_INTERVAL) {
        this.jobs = []
        this.interval = setInterval(this.jobHandler.bind(this), intervalTime)
    }

    jobHandler() {
        if (this.jobs.length > 0) {
            const job = this.jobs.pop()
            const { searchString, resolve, reject } = job
            const url = `https://thepiratebay.org/search/${encodeURIComponent(searchString)}/0/99/0`

            const req = request(url, (err, httpResponse, body) => {
                const $ = cheerio.load(body)
                const links = $('a[href]')
                    .map((index, link) => $(link).attr('href'))
                    .get()
                    .filter(href => !!href && href.length)
                    .filter(href => href.startsWith('magnet:'))
                    .filter(href => {
                        return searchString.split(' ').reduce((acc, val) => {
                            return acc && href.indexOf(val) > -1
                        }, true)
                    })
                
                if (links.length > 0) {
                    resolve(links[0])
                } else {
                    setTimeout(() => reject('PirateBayProvider did not return any results'), PIRATEBAY_REJECTION_DELAY)
                }
            })
        }
    }

    stop() {
        clearInterval(this.interval)
    }

    search(searchString) {
        return new Promise((resolve, reject) => {
            this.jobs.push({ searchString, resolve, reject })
        })
    }
}