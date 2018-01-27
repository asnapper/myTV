export class TorrentSearch {
    constructor(providers) {
        this.providers = providers || []
    }

    registerProvider(provider) {
        this.providers.push(provider)
        return () => this.unregisterProvider(provider)
    }

    unregisterProvider(provider) {
        const index = this.providers.indexOf(provider)
        if (index > -1) {
            this.providers.splice(index, 1)
        }
    }

    search(searchString) {
        if (Array.isArray(searchString)) {
            return Promise.race(searchString.map(s => this.search(s)))
        }
        return Promise.race(this.providers.map(provider => provider.search(searchString)))
    }

    stop() {
        this.providers.forEach(provider => provider.stop())
    }
}
