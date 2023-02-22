import { useState }              from "react"
import * as io                   from "socket.io-client"
import axios, { AxiosResponse }  from "axios"
import * as dfd                  from "danfojs"
import ReactEcharts              from "echarts-for-react"
import { title, tooltip, yAxis } from '../echarts/dependencies'
import PageBody                  from "../components/PageBody"
import PageHeader                from "../components/PageHeader"
import FormWrapper               from "../components/FormWrapper"


import "../components/componentStyles.css"

// TODO: =================================================================
// Add 'keys' back on backend and frontend
// Find max number of dots on screen and add it to the page heading
// Get everything done with HTTP then move forward with Sockets (Step 7)
    // Create socket connection from server side to client side
// =======================================================================

const socket = io.connect()

const Home = () => {
  // TODO: Uncomment once I know when we will use the form again.
  // let initialState: InputValues = { x: 0, y: 0 }
  let echartsComponentStyle = { width: '100vw', height: '80vh' }

  // TODO: Uncomment once I know when we will use the form again.
  // const [inputs, setInputs] = useState<InputValues>(initialState)
  const [df, setDf] = useState<dfd.DataFrame>(new dfd.DataFrame([], { "index": [], "columns" : ["x", "y"], "dtypes": ["float32", "float32"] }))
  // const [socketDf, setSocketDf] = useState<dfd.DataFrame>(new dfd.DataFrame([], { "index": [], "columns" : ["x", "y"], "dtypes": ["float32", "float32"] }))
  const [toggleButton, setToggleButton] = useState<boolean>(false)

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
    // df.print()
    let tempStartIndex = Math.max(...df.index.map(i => +i)) + 1 
    // find the maximum number of existing indices
    const startIndex = tempStartIndex === -Infinity ? 0 : tempStartIndex 
    const indices = Array.from(Array(numberOfIndices), (_, index) => index + startIndex)
    // Return the df.append with values and indices
    return df.append(dataToAdd.map(d => [d.x, d.y]), indices)
  }
  
  let maxValueWithinDf = df.max().values
  let minValueWithinDf = df.min().values  
  let maxVal = Math.max(...maxValueWithinDf.map(i => +i)) // TODO: 2. Check to see if this value are correct.
  let minVal = Math.min(...minValueWithinDf.map(i => +i)) // TODO: 3. Check to see if this value are correct.

  // TODO:
  // We have dimension 0 => coloured to first column which in our case is X
  // If we hvae dimension 1 => coloured to second column Y
  // So what we need to do is colour it as column one by column two (X + Y)

  // How this could be achieved is by adding a third column, which takes column one and column two to be called "Z" in our case.
  // As a side note, we should then be able to make our current plot 2 dimensional and it should work.

  // console.log("Max & Min values \n", maxValueWithinDf, minValueWithinDf)

  // Colour Map min and max values are not computing properly, fix this.

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
        emphasis: {
          focus: 'series'
        },
        data: df.values,
        symbolSize: 11,
      },
    ]
  }

  const subscribeToSocket = () => {
    socket.emit("subscribe")
    console.log("Subscribed to socket connection")
  }
  
  const unsubscribeFromSocket = () => {
    socket.emit("unsubscribe")
    console.log("Unsubscribed to socket connection")
  }

  const handleToggleButton = () => {
    setToggleButton(!toggleButton)
    if (toggleButton) {
      unsubscribeFromSocket()
    } else {
      subscribeToSocket()
    }
  }

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
       
        {/* <Buttons type="submit" onClick={ handleClick } buttonTitle="Click to Add" /> */}
      </FormWrapper>
      <div>
        <br />
        <button className="btn" onClick={ handleClick } >Add Rows</button>
        { 
          toggleButton ? 
          <button className="btn" onClick={ handleToggleButton }>Unsubscribe</button>
          : 
          <button className="btn" onClick={ handleToggleButton }>Subscribe</button> 
        }
      </div>
    </PageBody>
  )
}

export default Home