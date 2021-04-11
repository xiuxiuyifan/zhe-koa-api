const koa = require('koa')
const koaBodyparser = require('koa-bodyparser')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')

// require('./app/models/user')
// require('./app/models/classic')
// require('./app/models/flow')
// require('./app/models/favor')
// require('./app/models/book')

// require('./app/models/book-comment')

const app = new koa()
app.use(catchError)

app.use(koaBodyparser())
InitManager.initCore(app)


app.listen(3000)


