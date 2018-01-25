import request from 'request'
import cheerio from 'cheerio'
import { clearInterval, setInterval } from 'timers';

export class EzTVProvider {
    constructor(intervalTime = process.env.EZTV_INTERVAL || 1000) {
        this.jobs = []
        this.interval = setInterval(this.jobHandler.bind(this), intervalTime)
    }

    jobHandler() {
        if (this.jobs.length > 0) {
            const job = this.jobs.pop()
            const { searchString, resolve, reject } = job

            const req = request(`https://eztv.ag/search/${searchString.replace(' ', '-')}`, (err, httpResponse, body) => {
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
                    reject('provider did not return any results')
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