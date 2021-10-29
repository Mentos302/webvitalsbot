const fs = require('fs')
const path = require('path')

class FileService {
  async getfilePath() {
    const fileNames = fs.readdirSync(path.resolve('./my-downloads'))

    return path.resolve(path.join(`./my-downloads`, fileNames[0]))
  }
}

module.exports = new FileService()
