import { useState }   from 'react'
import socketIO                  from "socket.io-client"
import * as dfd                  from "danfojs"
import ReactEcharts              from "echarts-for-react"
import { title, tooltip, yAxis } from "../echarts/dependencies"

function Test() {
  const [df, setDf] = useState<dfd.DataFrame>(new dfd.DataFrame([], { "index": [], "columns" : ["x", "y"], "dtypes": ["float32", "float32"] }))

  let echartsComponentStyle = { width: '100vw', height: '50vh' }

  let maxValueWithinDf = df.max().values
  let minValueWithinDf = df.min().values  
  let maxVal           = Math.max(...maxValueWithinDf.map(i => +i))
  let minVal           = Math.min(...minValueWithinDf.map(i => +i))

  function appendToDataframe(df: dfd.DataFrame, dataToAdd: any[]) {
    const numberOfIndices: number = dataToAdd.length
    let tempStartIndex = Math.max(...df.index.map(i => +i)) + 1 
    const startIndex = tempStartIndex === -Infinity ? 0 : tempStartIndex 
    const indices = Array.from(Array(numberOfIndices), (_, index) => index + startIndex)
    return df.append(dataToAdd.map(d => [d.x, d.y]), indices)
  }

  const options = {
    title,
    visualMap: {
      min: minVal === Infinity  ? 0 : minVal,
      max: maxVal === -Infinity ? 0 : maxVal,
      orient: 'vertical',
      dimension: 0,
      calculable: true,
      inRange: {
        color: ['blue', 'chartreuse', 'red'],
      }
    },
    tooltip,
    xAxis: {
      type:  'value',
      scale: 'true',
    },
    yAxis,
    series: [
      {
        type: 'scatter',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        data: df.values,
        symbolSize: 11,
      },
    ]
  }
  
  const socket = socketIO("http://127.0.0.1:5000")

  document.addEventListener('keydown', e => {
    if (e.key === 'c') socket.connect()
    if (e.key === 'd') socket.disconnect()
  })

  const handleClickEvent = (Df: any) => () => socket.on("message", (data) => {
    setDf(appendToDataframe(Df, data))
  })
  

  console.log(df.values)
  return (
    <div>
      <ReactEcharts option={ options } style={ echartsComponentStyle } />
      <br />
      <div>
        <button className="btn" onClick={ handleClickEvent(df) }>Go!</button>
      </div>
    </div>
  )
}

export default Test