const BrowserService = require('../services/BrowserService')
const FileService = require('../services/FileService')

class AppControler {
  async getReportByURL(url) {
    await BrowserService.loginAndGetPDF(url)
    const reportPath = await FileService.getfilePath()

    return reportPath
  }
}

module.exports = new AppControler()
