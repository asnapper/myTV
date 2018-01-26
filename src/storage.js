import fs from 'fs'
import { STORAGE_PATH } from './constants'

export const episodes = []

export function loadEpisodes() {
    if (fs.existsSync(STORAGE_PATH)) {
        JSON.parse(fs.readFileSync(STORAGE_PATH)).forEach(entry => {
            episodes.push(entry)
        });
    }
}

export function saveEpisodes() {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(episodes))
}