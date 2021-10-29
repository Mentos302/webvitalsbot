module.exports = () => {
  const Scene = require('telegraf/scenes/base')

  const scene = new Scene('urlrequest')
  const controller = require('../../controllers/urlController')

  scene.enter(controller.requestURL)

  scene.on('text', controller.resURL)

  scene.on('message', controller.msgTypeError)

  return scene
}
