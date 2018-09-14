require('dotenv').config()

const Koa = require('koa')
const router = require('koa-router')()
const koaBody = require('koa-bodyparser')
const compress = require('koa-compress')
const logger = require('koa-logger')

const routes = require('./routes')
const { PORT } = process.env

const app = new Koa()

app.use(logger())
app.use(koaBody())

app.use(function(ctx, next) {
    ctx.body = ctx.request.body
    return next()
})

app.use(compress({
  filter: function (content_type) {
  	return /text/i.test(content_type)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))

router.use('', routes.routes(), routes.allowedMethods())
app.use(router.routes(), router.allowedMethods())

console.log("api is running on port:", PORT)
app.listen(PORT)
