const express    = require('express')
const bodyParser = require('body-parser')
const cors       = require('cors')
const sequelize  = require('./db')
const Step       = require('./models/Step')

sequelize.sync({ force: true }).then(() => console.log('DB connection established'))

const app  = express()
const PORT = 5000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/steps', async (req, res) => {
  await Step.create(req.body)
  res.send('Row inserted successfully')
})

app.get('/steps', async (req, res) => {
  const steps = await Step.findAll()
  res.send(steps)
})

app.get('/steps/:id', async (req, res) => {
  const requestedId = req.params.id
  const step = await Step.findOne({ where: { id: requestedId } })
  res.send(step)
})

app.put('/steps/:id', async (req, res) => {
  const requestedId = req.params.id
  const step = await Step.findOne({ where: { id: requestedId } })
  step.key = req.body.key
  step.x = req.body.x
  step.y = req.body.y
  await step.save()
  res.send('Updated successful')
})

app.delete('/steps/:id', async (req, res) => {
  const requestedId = req.params.id
  await Step.destroy({ where: { id: requestedId } })
  res.send('Delete successful')
})


app.get('/random-scatter-data', (req, res) => {
  let randomArrayInRange = (min, max, n = 100) =>
      Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min)
      
  // let valueOfTheKey = 'pwal'
  let x = Object.values(randomArrayInRange(-50, 50, 5)).map((i) => i)
  let y = Object.values(randomArrayInRange(-50, 50, 5)).map((i) => i)
  let zip = (x, y) => Array.from(Array(Math.max(x.length, y.length)), (_, i) => [x[i], y[i]])
  let numericData = zip(x, y).map((arr) => { return { x: arr[0], y: arr[1] }}) // "key": valueOfTheKey,
  // console.log(numericData)
  
  // let maxArrValue = Math.max(...numericData[x])
  // console.log(maxArrValue)
  res.send(numericData)
})

app.listen(PORT, () => console.log(`Server running on ${PORT}`))