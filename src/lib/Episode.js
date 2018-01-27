export class Episode {
    constructor(data = {}) {
        this.airDate = data.airDate
        this.show = data.show
        this.episodeNumber = data.episodeNumber
        this.seasonNumber = data.seasonNumber
        this.processing = data.processing
        this.magnetLink = data.magnetLink
    }

    toString(alternateFormat = false) {
        let showString = `${this.show.replace('(', '').replace(')', '')}`
        let episodeString = `${this.episodeNumber}`
        let seasonString = `${this.seasonNumber}`

        if (episodeString.length === 1)
            episodeString = `0${episodeString}`
        
        if (seasonString.length === 1)
            seasonString = `0${seasonString}`
        if (alternateFormat) {
            return `${showString} ${seasonString}x${episodeString}`
        } else {
            return `${showString} S${seasonString}E${episodeString}`
        }
    }
}