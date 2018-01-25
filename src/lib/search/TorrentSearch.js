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
        return Promise.race(this.providers.map(provider => provider.search(searchString)))
    }
}
