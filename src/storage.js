import fs from 'fs'
import { STORAGE_PATH } from './constants'
import { Episode } from './lib/Episode'

export const episodes = []

export function loadEpisodes() {
    if (fs.existsSync(STORAGE_PATH)) {
        JSON.parse(fs.readFileSync(STORAGE_PATH)).forEach(entry => {
            entry.processing = false
            episodes.push(new Episode(entry))
        });
    }
}

export function saveEpisodes() {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(episodes, null, 2))
}