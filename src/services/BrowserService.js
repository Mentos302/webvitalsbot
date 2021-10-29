const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

class BrowserService {
  constructor() {
    this.startBrowser = this.startBrowser
    this.authorization = this.authorization
    this.createReport = this.createReport
    this.getPDF = this.getPDF
  }

  async loginAndGetPDF(url) {
    const client = await this.startBrowser()

    await this.authorization(client)
    await this.createReport(client, url)
    await this.getPDF(client)
  }

  async startBrowser() {
    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: false,
      })

      let page = await browser.newPage()

      const navigationPromise = page.waitForNavigation()
      await page.goto('https://accounts.google.com')

      await navigationPromise

      return { browser, page }
    } catch (e) {
      throw new Error(`Browser openning error`)
    }
  }

  async authorization({ browser, page }) {
    try {
      await page.waitForSelector('input[type="email"]')
      await page.click('input[type="email"]')

      await page.type('input[type="email"]', process.env.GMAIL_EMAIL)

      await page.waitForSelector('#identifierNext')
      await page.click('#identifierNext')

      await page.waitForTimeout(2000)

      await page.waitForSelector('input[type="password"]')
      await page.click('input[type="password"]')

      await page.waitForTimeout(2000)

      await page.type('input[type="password"]', process.env.GMAIL_PASSWORD)

      await page.waitForSelector('#passwordNext')
      await page.click('#passwordNext')

      await page.waitForTimeout(2000)
    } catch (e) {
      console.log(e)

      await browser.close()

      throw new Error(`Authorization error`)
    }
  }

  async createReport({ browser, page }, url) {
    try {
      await page.goto(
        'https://datastudio.google.com/datasources/create?connectorId=AKfycbxk7u2UtsqzgaA7I0bvkaJbBPannEx0_zmeCsGh9bBZy7wFMLrQ8x24WxpBzk_ln2i7'
      )

      await page.waitForSelector('input[type="text"]')
      await page.type('input[type="text"]', url)

      await page.click('button.connect')

      await page.waitForSelector('button[ng-click="$ctrl.createReport()"]')
      await page.click('button[ng-click="$ctrl.createReport()"]')

      await page.waitForSelector('input[ng-disabled="$ctrl.isDisabled"]')

      await page.waitForTimeout(5000)
      await page.click('input[ng-disabled="$ctrl.isDisabled"]')

      await page.waitForTimeout(5000)
    } catch (e) {
      console.log(e)
      await browser.close()

      throw new Error(`Report creating error`)
    }
  }

  async getPDF({ browser }) {
    try {
      const pages = await browser.pages()

      const page = pages[2]

      await page.waitForTimeout(10000)

      await page.waitForSelector('.mat-menu-trigger')
      await page.click('.mat-menu-trigger')

      await page.waitForTimeout(5000)

      await page.waitForSelector(
        '#mat-menu-panel-2 > div > button:nth-child(5)'
      )
      await page.click('#mat-menu-panel-2 > div > button:nth-child(5)')

      await page.waitForTimeout(1000)

      await page.waitForSelector('button[ng-click="$ctrl.download()"]')
      await page.click('button[ng-click="$ctrl.download()"]')

      const download_path = path.resolve('./my-downloads')

      await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        userDataDir: './',
        downloadPath: download_path,
      })

      let isDone = false

      while (!isDone) {
        const files = fs.readdirSync(path.resolve('./my-downloads'))

        if (files[0]) {
          const arr = files[0].split('.')

          if (arr[arr.length - 1] === 'pdf') isDone = true
        }
      }

      await page.waitForTimeout(2000)

      await browser.close()
    } catch (e) {
      console.log(e)
      await browser.close()

      throw new Error(`PDF downloading error`)
    }
  }
}

module.exports = new BrowserService()
