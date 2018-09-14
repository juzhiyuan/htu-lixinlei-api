const router = require('koa-router')()

router.get('', async ctx => {
  ctx.body = {
    msg: 'hi'
  }
})

module.exports = router
