const bot = require('../bot')

;(async () => {
  try {
    // await bot.launch()

    // console.log(`Application has been started!`)
    const AppController = require('./controllers/AppController')

    const filePath = await AppController.getReportByURL('sorare.com')

    console.log(filePath)
  } catch (e) {
    console.log(`Something went wrong!`)
  }
})()
