
export class DummyProvider {
    search(searchString) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(`magnet:${searchString}`), 1000 + Math.floor(Math.random * 5000))
        })
    }
}
