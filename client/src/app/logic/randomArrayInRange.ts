// let dfMaxIndex = Math.max(...df.index.map(x => +x))
// console.log(dfMaxIndex)

let randomArrayInRange = (min: number, max: number, n = 100) =>
    Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min)
  
let numberOfDataPointsToAdd = 5
let startIndex = 5 + 1

let x   = Object.values(randomArrayInRange(-50, 50, numberOfDataPointsToAdd)).map((i) => i)
let y   = Object.values(randomArrayInRange(-10, 50, numberOfDataPointsToAdd)).map((i) => i)
let zip = (x: number[], y: number[]) => Array.from(Array(Math.max(x.length, y.length)), (_, i) => [x[i], y[i]])



export const numericData    = zip(x, y)
export const arrayOfIndices = Array.from(Array(numberOfDataPointsToAdd), (_, index) => index + startIndex)


