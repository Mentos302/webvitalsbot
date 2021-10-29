const bot = require('../bot')

;(async () => {
  try {
    await bot.launch()

    console.log(`Application has been started!`)
  } catch (e) {
    console.log(`Something went wrong!`)
  }
})()
// const AppController = require('./controllers/AppController')

// const filePath = await AppController.getReportByURL(url)

// console.log(filePath)
