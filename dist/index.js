let express = require('express')
let bodyParser = require('body-parser')
let fs = require('fs')
let app = express()
let proxy = require('express-http-proxy')

const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || 'localhost'
const PUBLIC_DIR = __dirname + '/public'

app.set('port', PORT)
app.use(require('compression')()) // gzip 压缩
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// app.use(require('./image')())

app.use(require('webp-middleware')(__dirname + '/data/public', {}))
app.use(require('webp-middleware')(PUBLIC_DIR, {}))
app.use(express.static(__dirname + '/data/public'))
app.use(express.static(PUBLIC_DIR))

app.use('/admin/', proxy('120.132.18.132', {
  proxyReqPathResolver: req => '/admin/v1' + require('url').parse(req.url).path
}))
app.use('/api/', proxy('120.132.18.132', {
  proxyReqPathResolver: req => '/api/v1' + require('url').parse(req.url).path
}))

app.get('/admin', (req, res) => {
  res.sendFile(PUBLIC_DIR + '/admin.html')
})

app.get('/origin-university', (req, res) => res.sendFile(PUBLIC_DIR + '/form.html'))
app.get('/design', (req, res) => res.sendFile(PUBLIC_DIR + '/trydesignlab.html'))
app.get('/neo', (req, res) => res.sendFile(PUBLIC_DIR + '/neo.html'))
app.get('/meow', (req, res) => res.sendFile(PUBLIC_DIR + '/meow.html'))

app.get('/test', (req, res) => res.send(req.query))

app.get('/meow/count', (req, res) => {
  let data = JSON.parse(fs.readFileSync(__dirname + '/data/meow.json').toString())
  if (req.query.course) {
    data.push(req.query.course)
    fs.writeFileSync(__dirname + '/data/meow.json', JSON.stringify(data))
  }
  res.send(data)
})
app.get('/design/enroll', (req, res) => {
  fs.open(__dirname + '/data/design-enroll.txt', 'a', (err, fd) => {
    if (err) {
      res.send({error: err.stack})
    } else {
      fs.write(fd, req.query.email + '; ' + req.query.username + '\n', (err) => {
        fs.closeSync(fd)
        if (err) res.send({error: err.stack})
        else res.send({ok: true})
      })
    }
  })
})
app.post('/origin-university', (req, res) => {
  let {md, id} = req.body
  if (md && id) {
    fs.writeFileSync(__dirname + `/data/origin-university/${id}:${Date.now()}-${Math.random().toFixed(16).substr(2, 3)}.md`, md)
  }
  res.send({ok: true})
})

app.listen(PORT, HOST, function() {
  console.log(`Node app is running on http://${HOST}${PORT == 80 ? '' : ':' + PORT}`)
})
