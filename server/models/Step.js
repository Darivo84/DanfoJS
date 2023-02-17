const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class Step extends Model {}

Step.init({
  key: {
    type: DataTypes.STRING
  },
  x: {
    type: DataTypes.NUMBER
  },
  y: {
    type: DataTypes.NUMBER
  },
}, {
  sequelize,
  modelName: 'step',
  timestamps: false
})

module.exports = Step