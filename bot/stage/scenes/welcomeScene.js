module.exports = () => {
  const Scene = require('telegraf/scenes/base')

  const scene = new Scene('welcome')
  const controller = require('../../controllers/urlController')

  scene.enter(controller.welcomeMessage)

  scene.action('req', controller.toRequestURL)

  scene.on('message', (ctx) => ctx.scene.reenter())

  return scene
}
