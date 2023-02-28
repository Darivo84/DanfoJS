const express = require('express')
const router  = express.Router()

// const { io } = require('socket.io')

router.get('/', (req, res) => {
  let randomArrayInRange = (min, max, n = 100) =>
      Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min)
  // let valueOfTheKey = 'pwal'
  let maxRange = 50
  let minRange = -50
  let x = Object.values(randomArrayInRange(minRange, maxRange, 1)).map((i) => i)
  let y = Object.values(randomArrayInRange(minRange, maxRange, 1)).map((i) => i)
  let zip = (x, y) => Array.from(Array(Math.max(x.length, y.length)), (_, i) => [x[i], y[i]])
  let numericData = zip(x, y).map((arr) => { return { x: arr[0], y: arr[1] }}) // "key": valueOfTheKey,

  res.send(numericData)
})

module.exports = router