const express = require('express')
const router  = express.Router()
const Step    = require('../models/Step')

router.post('/', async (req, res) => {
  await Step.create(req.body)
  res.send('Row inserted successfully')
})

router.get('/', async (req, res) => {
  const steps = await Step.findAll()
  res.send(steps)
})

router.get('/:id', async (req, res) => {
  const requestedId = req.params.id
  const step = await Step.findOne({ where: { id: requestedId } })
  res.send(step)
})

router.put('/:id', async (req, res) => {
  const requestedId = req.params.id
  const step = await Step.findOne({ where: { id: requestedId } })
  step.key = req.body.key
  step.x = req.body.x
  step.y = req.body.y
  await step.save()
  res.send('Updated successful')
})

router.delete('/:id', async (req, res) => {
  const requestedId = req.params.id
  await Step.destroy({ where: { id: requestedId } })
  res.send('Delete successful')
})

module.exports = router