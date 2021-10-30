const fs = require('fs')
const Extra = require('telegraf/extra')
const AppController = require('../../src/controllers/AppController')

class AccountControllers {
  welcomeMessage(ctx) {
    ctx.reply(
      `👋 Здравствуйте, <b>${ctx.from.first_name}</b>\n\nЯ чат-бот, созданный для получения отчётов с <code>Google Data Studio</code>.`,
      Extra.HTML().markup((m) =>
        m.inlineKeyboard([[m.callbackButton(`📝 Получить новый отчёт`, 'req')]])
      )
    )
  }

  toRequestURL(ctx) {
    ctx.scene.enter('urlrequest')
  }

  requestURL(ctx) {
    ctx.reply(
      `🖥 Чтобы получить <b>отчёт в виде PDF-файла</b>, отправьте мне ссылку на сайт, для анализа.\n\n<i>Пример: <code>sorare.com</code>
      </i>`,
      Extra.HTML()
    )
  }

  async resURL(ctx) {
    ctx.reply(
      `📋 Хорошо, сейчас подготовлю для Вас <b>отчёт по сайту ${ctx.message.text}</b>, ожидайте.`,
      Extra.HTML()
    )
    const url = ctx.message.text
    let filePath

    try {
      filePath = await AppController.getReportByURL(url)

      if (filePath) {
        await ctx.scene.leave()

        await ctx.reply(`✅ Ваш отчёт <b>готов!</b>`, Extra.HTML())

        await ctx.replyWithDocument(
          {
            source: filePath,
          },
          Extra.markup((m) =>
            m.inlineKeyboard([
              [m.callbackButton(`📝 Получить новый отчёт`, 'rndmsht')],
            ])
          )
        )

        fs.unlinkSync(filePath)
      } else {
        ctx.reply(`🚧 Не смогли получить отчёт, данных о сайте не накоплено.`)
      }
    } catch (e) {
      ctx.reply(`Произошла ошибка, \n\n<code>${e}</code>`, Extra.HTML())
    }
  }

  msgTypeError(ctx) {
    ctx.reply('🤷‍♂️ Не понимаю, введите текст!')

    ctx.scene.reenter()
  }
}

module.exports = new AccountControllers()
