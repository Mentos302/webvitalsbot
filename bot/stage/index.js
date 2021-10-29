const Stage = require('telegraf/stage')

module.exports = (bot) => {
  const WelcomeScene = require('./scenes/welcomeScene')()
  const RequestingScene = require('./scenes/urlRequestScene')()

  const stage = new Stage([WelcomeScene, RequestingScene], {
    ttl: 120,
  })

  bot.use(stage.middleware())
}
