const express    = require('express')
const bodyParser = require('body-parser')
const cors       = require('cors')
const http       = require('http')
const sequelize  = require('./db')
const stepRoutes = require('./routes/Steps')
const randomData = require('./routes/RandomScatterData')
const { Server } = require('socket.io')

sequelize.sync({ force: true }).then(() => console.log('DB connection established'))

const app    = express()
const PORT   = 5000
const server = http.createServer(app)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/steps', stepRoutes)
app.use('/random-scatter-data', randomData)

const io = new Server(server, {
  cors: {
    origin: 'https://localhost:3000',
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  console.log(`UI connected: ${socket.id}`)

  socket.on("subscribe", () => {
    socket.join()
    console.log(`Subscribed: ${socket.id}`)
  })

  socket.on("disconnect", () => {
    console.log("Connection closed", socket.id)
  })
})

io.off("unsubscribe", (socket) => console.log(`Unsubscibed: ${socket.id}`))

server.listen(PORT, () => console.log(`Server running on ${PORT}`))