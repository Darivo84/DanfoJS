const express    = require('express')
const bodyParser = require('body-parser')
const cors       = require('cors')
const http       = require('http')
const { Server } = require('socket.io')
const sequelize  = require('./db')
const stepRoutes = require('./routes/Steps')
const randomData = require('./routes/RandomScatterData')

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
    origin: '*'
  }
})

io.on("connection", (socket) => {
  console.log('connected')
  setInterval(() => {
    let randomArrayInRange = (min, max, n = 100) =>
      Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min)
    let maxRange = 50
    let minRange = -50
    let x = Object.values(randomArrayInRange(minRange, maxRange, 1)).map((i) => i)
    let y = Object.values(randomArrayInRange(minRange, maxRange, 1)).map((i) => i)
    let zip = (x, y) => Array.from(Array(Math.max(x.length, y.length)), (_, i) => [x[i], y[i]])
    let numericData = zip(x, y).map((arr) => { return { x: arr[0], y: arr[1] }})
    
    socket.volatile.emit("message", numericData) }, 1000)
})

// TODO: =================================================================  
// 1. Then add it to state and therefore the visualisation - Ongoing
// 2. Have fun playing with ws and http at the same time - Clear
// 3. Create a ws endpoint to generate the random dummy data to display on UI dataframe 

// Complete: =============================================================
// Send ping message to server from client and log in console (BE) - Done
// Send pong message to client from server and log in console (FE) - Done
// Then replace by JSON and when socket is alive send one datapoint per second and log it on the frontend - Done

server.listen(PORT, () => console.log(`Server running on ${PORT}`))