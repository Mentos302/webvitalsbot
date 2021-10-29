const sceneInitialisation = require('./stage')
const rateLimit = require('telegraf-ratelimit')
const session = require('telegraf/session')
const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.catch((error) => {
  console.log(error)
})

bot.use(
  session({
    getSessionKey: (ctx) =>
      ctx.from && `${ctx.from.id}:${(ctx.chat && ctx.chat.id) || ctx.from.id}`,
  })
)

const limitConfig = {
  window: 1000,
  limit: 1,
  onLimitExceeded: (ctx) => ctx.reply('Превышение лимита, попробуйте ещё раз!'),
}

bot.use(rateLimit(limitConfig))

sceneInitialisation(bot)

bot.use((ctx) => ctx.scene.enter('welcome'))

module.exports = bot
