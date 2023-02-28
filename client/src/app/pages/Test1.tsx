import { Component }             from 'react'
import socketIO                  from "socket.io-client"
import * as dfd                  from "danfojs"
import ReactEcharts              from "echarts-for-react"
import { title, tooltip, yAxis } from "../echarts/dependencies"

class Test1 extends Component {
  values: any
  dataframe: any
  state: any
  
  constructor(props: any) {
    super(props)
    this.state = {
      df: new dfd.DataFrame([], { "index": [], "columns" : ["x", "y"], "dtypes": ["float32", "float32"] })
    }
  }

  echartsComponentStyle = { width: '100vw', height: '50vh' }
  
  appendToDataframe(df: dfd.DataFrame, dataToAdd: any[]) {
    const numberOfIndices: number   = dataToAdd.length
    const tempStartIndex:  number   = Math.max(...df.index.map(i => +i)) + 1 
    const startIndex:      number   = tempStartIndex === -Infinity ? 0 : tempStartIndex 
    const indices:         number[] = Array.from(Array(numberOfIndices), (_, index) => index + startIndex)
    
    return df.append(dataToAdd.map(d => [d.x, d.y]), indices)
  }
  
  handleClick() {
    return () => {
      let socket = socketIO('http://127.0.0.1:5000')
      socket.on('message', (response) => {
        this.setState({
          df: this.appendToDataframe(this.state.df, response)
        })
        // this.df.print()
      })
    }
  }

  render() {

    const options = {
      title,
      visualMap: {
        min: -50,
        max: 50,
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
          data: this.state.df.values,
          symbolSize: 11,
        },
      ]
    }
    
    return (
      <div>
        <ReactEcharts option={ options } style={ this.echartsComponentStyle } />
        <br />
        <button className="btn" onClick={ this.handleClick() }>Connect</button>
      </div>
    )
  }
}

export default Test1