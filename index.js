function randomId () {
  return Math.floor(100000 * Math.random())
}
const jsonServer = require('json-server')
const server = jsonServer.create()
const history = require('connect-history-api-fallback')
const middlewares = jsonServer.defaults({static: '.'})
const router = jsonServer.router('./assets/data/data.json')

server.use(history())
server.use(middlewares)
server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}))
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/boards') {
    
    req.body.id = randomId()
    req.body.starred = false

  }

  if (req.method === 'GET' && req.path.match(/\/boards\/\d*/g)) {

    let id = parseInt(req.path.replace('/boards/', ''));
    let board = router.db.get('boards').find({ id }).value();
    let lists = router.db.get('lists').filter({ boardId: id }).sortBy('order').value();
    let tasks = router.db.get('tasks').filter({ boardId: id }).sortBy('order').value();

    let result = { ...board, lists: lists, tasks: tasks }

    let response = res.status(200).jsonp(result)

    return response
    
  }

  if (req.method === 'POST' && req.path === '/lists') {
    
    req.body.id = randomId()

  }

  next()
})

server.use(router)
server.listen(3000, () => {
  console.log('🚀 Trello app is up and running at:\n')
  console.log('\x1b[4m\x1b[33m%s\x1b[0m', 'http://localhost:3000\n');  //yellow
  console.log('Enjoy!')
})