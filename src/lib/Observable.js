export class Observable {
    constructor() {
        this.observer = []
    }

    subscribe(observer) {
        this.observer.push(observer)
        return () => this.unsubscribe(observer)
    }

    unsubscribe(observer) {
        const index = this.observer.indexOf(observer)
        if (index > -1) {
            this.observer.splice(index, 1)
        }
    }

    notifyObserver(data) {
        this.observer.forEach(observer => observer(data))
    }
}