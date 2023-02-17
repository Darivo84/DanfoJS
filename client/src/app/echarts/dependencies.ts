let minimumForVisualMap = -40
let maximumForVisualMap = 40

export const title = {
  text: "Christmas Plan",
  top: 20,
  left: 'center'
}

export const visualMap = {
  min: minimumForVisualMap,
  max: maximumForVisualMap,
  calculable: true,
  inRange: {
    color: ['blue', 'chartreuse', 'red']
  }
}

export const tooltip = {
  trigger: 'item',
  axisPointer: {
    type: 'axisPointer'
  }
}

export const xAxis = [{
  type:  'value',
  scale: 'true'
}]

export const yAxis = [{
  type:  'value',
  scale: 'true'
}] 