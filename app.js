const koa = require('koa')
const koaBodyparser = require('koa-bodyparser')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')


const app = new koa()
app.use(catchError)

app.use(koaBodyparser())
InitManager.initCore(app)


app.listen(3000)
