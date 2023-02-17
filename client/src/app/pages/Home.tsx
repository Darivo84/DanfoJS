import { useState }             from "react"
import axios, { AxiosResponse } from "axios"
import * as dfd                 from "danfojs"
import ReactEcharts             from "echarts-for-react"

import { 
  title, 
  tooltip, 
  xAxis, 
  yAxis 
} from '../echarts/dependencies'

import PageBody    from "../components/PageBody"
import PageHeader  from "../components/PageHeader"
import FormWrapper from "../components/FormWrapper"

import "../components/componentStyles.css"

// TODO: =================================================================
// Add 'keys' back on backend and frontend
// Find max number of dots on screen and add it to the page heading
// Get everything done with HTTP then move forward with Sockets (Step 7)
    // Create socket connection from server side to client side
// =======================================================================

const Home = () => {
  // TODO: Uncomment once I know when we will use the form again.
  // let initialState: InputValues = { x: 0, y: 0 }
  let echartsComponentStyle = { width: '100vw', height: '50vh' }

  // TODO: Uncomment once I know when we will use the form again.
  // const [inputs, setInputs] = useState<InputValues>(initialState)
  const [df, setDf] = useState<dfd.DataFrame>(new dfd.DataFrame([], { "index": [], "columns" : ["x", "y"], "dtypes": ["float32", "float32"] }))

  const getScatterData = () => { 
    axios
      .get('http://localhost:5000/random-scatter-data')
  }
  
  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    getScatterData()
  }
  
  // TODO: Uncomment once I know when we will use the form again.
  // const onChangeHandler = (event: HTMLInputElement) => {
  //   const {name, value} = event
  //   setInputs((prev) => {
  //     return { ...prev, [name]: value }
  //   })
  // }

  const handleClick = () => {
    axios
      .get('http://localhost:5000/random-scatter-data')
      .then((response: AxiosResponse) => setDf(appendToDataframe(df, response.data))) 
  }

  function appendToDataframe(df: dfd.DataFrame, dataToAdd: any[]) {  // previous dataToAdd type is object[]
    const numberOfIndices: number = dataToAdd.length
    df.print()
    let tempStartIndex = Math.max(...df.index.map(i => +i)) + 1 
    // find the maximum number of existing indices
    const startIndex = tempStartIndex === -Infinity ? 0 : tempStartIndex 
    const indices = Array.from(Array(numberOfIndices), (_, index) => index + startIndex)
    // Return the df.append with values and indices
    return df.append(dataToAdd.map(d => [d.x, d.y]), indices)
  }
  
  let maxValueWithinDf = df.max().values
  let minValueWithinDf = df.min().values  
  let maxVal = Math.max(...maxValueWithinDf.map(i => +i))
  let minVal = Math.min(...minValueWithinDf.map(i => +i))
 
  const options = {
    title,
    visualMap: {
      min: minVal === Infinity  ? 0 : minVal,
      max: maxVal === -Infinity ? 0 : maxVal,
      calculable: true,
      inRange: {
        color: ['blue', 'chartreuse', 'red']
      }
    },
    tooltip,
    xAxis,
    yAxis,
    series: [
      {
        type: 'scatter',
        emphasis: {
          focus: 'series'
        },
        data: df.values,
        symbolSize: 11,
      },
    ]
  }

  // TODO: Colour along the x axis next to create a gradient effect

  return (
    <PageBody>
      <PageHeader header={ 'Max value of dataframe' } />
      <ReactEcharts option={ options } style={ echartsComponentStyle } />
      <FormWrapper onSubmit={ submitForm } >
        {/* TODO: Uncomment once I know when we will use the form again. */}
        {/* <Input 
          name="x"
          placeholder="X value..." 
          value={ inputs.x } 
          onChange={ (e: any) => onChangeHandler(e.target) }
        />
        <Input
          name="y"
          placeholder="Y value..." 
          value={ inputs.y } 
          onChange={ (e: any) => onChangeHandler(e.target) }
        /> */}
        {/* <Buttons type="submit" buttonTitle="Click to Add" /> */}
      </FormWrapper>
      <div>
        <br />
        <button className="btn" onClick={ handleClick } >Add Rows</button>
      </div>
    </PageBody>
  )
}

export default Home