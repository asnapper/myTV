export class Episode {
    constructor(data = {}) {
        this.airDate = data.airDate
        this.show = data.show
        this.episodeNumber = data.episodeNumber
        this.seasonNumber = data.seasonNumber
        this.processing = data.processing
        this.magnetLink = data.magnetLink
    }

    toString() {
        let episodeString = `${this.episodeNumber}`
        let seasonString = `${this.seasonNumber}`

        if (episodeString.length === 1)
            episodeString = `0${episodeString}`
        
        if (seasonString.length === 1)
            seasonString = `0${seasonString}`
        
        return `${this.show} S${seasonString}E${episodeString}`
    }
}