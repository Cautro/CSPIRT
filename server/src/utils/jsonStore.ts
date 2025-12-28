import fs from 'fs'
import path from 'path'

export function readJSON<T>(file: string): T {
    const filePath = path.join(__dirname, '..', 'data', file)
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function writeJSON<T>(file: string, data: T) {
    const filePath = path.join(__dirname, '..', 'data', file)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}
