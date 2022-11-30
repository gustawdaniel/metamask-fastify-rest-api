import pJson from '../../package.json'

export class Version {
    static async root() {
        return {
            name: pJson.name,
            version: pJson.version,
        }
    }
}
