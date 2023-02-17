import { useState }             from "react"
import axios, { AxiosResponse } from "axios"
import * as dfd                 from "danfojs"
import ReactEcharts             from "echarts-for-react"

import { 
  title, 
  visualMap, 
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
    // print dataframe to console
    df.print()
    let tempStartIndex = Math.max(...df.index.map(i => +i)) + 1 
    // find the maximum number of existing indices
    let startIndex = tempStartIndex
    if(startIndex === -Infinity) {
      startIndex = 0
    }
    const indices = Array.from(Array(numberOfIndices), (_, index) => index + startIndex)
    // Return the df.append with values and indices
    return df.append(dataToAdd.map(d => [d.x, d.y]), indices)
  }

  /* TODO: 
    Next step is to automatically calculate the min and max in visualMap for color mapping 
    - find the min value of x and y in the same way I, possibly check something like this => console.log(df.sortValues("x", { inplace: true }))
  */
   
  const options = {
    title,
    visualMap,
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

  // map df.values to separate x and y values
  // const dfX = df.values.map((x, y) => ({x, y}))
  // const arr = [1, 2, 3]
  // const arr1 = [4, 5, 6]
  // const max = Math.max(...arr)
  // const min = Math.min(...arr)
  // console.log(max, min)
  // console.log(df.values)
  // console.log(dfX)

  // const merged = [...df.values]
  // console.log(merged)

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