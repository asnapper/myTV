import request from 'request'
import cheerio from 'cheerio'

export class EzTVProvider {
    search(searchString) {
        return new Promise((resolve, reject) => {
            // TODO: throttle requests to eztv.ag
            const req = request(`https://eztv.ag/search/${searchString.replace(' ', '-')}`, (err, httpResponse, body) => {
                const $ = cheerio.load(body)
                const links = $('a[href]')
                .map((index, link) => $(link).attr('href'))
                .get()
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
        })
    }
}