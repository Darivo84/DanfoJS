import { useState }   from "react"
import socketIO                  from "socket.io-client"
import axios, { AxiosResponse }  from "axios"
import * as dfd                  from "danfojs"
import ReactEcharts              from "echarts-for-react"
import { title, tooltip, yAxis } from "../echarts/dependencies"
import PageBody                  from "../components/PageBody"
import PageHeader                from "../components/PageHeader"
import FormWrapper               from "../components/FormWrapper"

import "../components/componentStyles.css"
// TODO: ===========================================================================================================================
// We have dimension 0 => coloured to first column which in our case is X
// If we hvae dimension 1 => coloured to second column Y
// So what we need to do is colour it as column one by column two (X + Y)

// How this could be achieved is by adding a third column, which takes column one and column two to be called "Z" in our case.
// As a side note, we should then be able to make our current plot 2 dimensional and it should work.

// console.log("Max & Min values \n", maxValueWithinDf, minValueWithinDf)

// Colour Map min and max values are not computing properly, fix this.
//  =================================================================================================================================
function Home() {
  // TODO: Uncomment once I know when we will use the form again.
  // let initialState: InputValues = { x: 0, y: 0 }
  let echartsComponentStyle = { width: '100vw', height: '50vh' }

  // TODO: Uncomment once I know when we will use the form again.
  // const [inputs, setInputs] = useState<InputValues>(initialState)
  const [df, setDf] = useState<dfd.DataFrame>(new dfd.DataFrame([], { "index": [], "columns" : ["x", "y"], "dtypes": ["float32", "float32"] }))
  const [toggleButton, setToggleButton] = useState<boolean>(false)

  // const [socketState, setSocketState] = useState([])

  // useEffect(() => {
  //   const socket = socketIO("http://127.0.0.1:5000")
  //   socket.on("message", (data) => {
  //     setSocketState(data)
  //   })
  // },[])

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

  function appendToDataframe(df: dfd.DataFrame, dataToAdd: any[]) {
    const numberOfIndices: number = dataToAdd.length
    // df.print()
    let tempStartIndex = Math.max(...df.index.map(i => +i)) + 1 
    const startIndex = tempStartIndex === -Infinity ? 0 : tempStartIndex 
    const indices = Array.from(Array(numberOfIndices), (_, index) => index + startIndex)
    return df.append(dataToAdd.map(d => [d.x, d.y]), indices)
  }
  
  let maxValueWithinDf = df.max().values
  let minValueWithinDf = df.min().values  
  let maxVal = Math.max(...maxValueWithinDf.map(i => +i)) // TODO: 1. Check to see if this value are correct.
  let minVal = Math.min(...minValueWithinDf.map(i => +i)) // TODO: 2. Check to see if this value are correct.

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
  
  const handleToggleButton = () => {
    setToggleButton(!toggleButton)
    if (toggleButton) {
      console.log('unsubscribe from socket connection')
    } else {
      const socket = socketIO('http://127.0.0.1:5000')
      socket.on("message", (data) => {
        // df.print()
        setDf(appendToDataframe(df, data))
        console.log('Random data from socket: \n', data)
      })
      console.log('subscribed to socket connection')
    }
  }

  if (toggleButton) {
    const socket = socketIO('http://127.0.0.1:5000')
      socket.on("message", (data) => {
        df.print()
        setDf(appendToDataframe(df, data))
        console.log('Random data from socket: \n', data)
      })
  }

  // useEffect(() => {
  //   const socket = socketIO('http://127.0.0.1:5000')
  //   socket.on("message", (data) => {
  //     setDf(appendToDataframe(df, data))
  //   })

  //   // eslint-disable-next-line 
  // }, [])

  // df.print()

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
        <button className="btn" onClick={ handleClick } >Add Rows from HTTP</button>
        { 
          toggleButton ? 
            <button 
              className="btn" 
              onClick={ handleToggleButton } 
              style={{ backgroundColor: 'red', border: '1px solid red' }}>
                Unsubscribe From Socket
            </button>
            : 
            <button 
              className="btn" 
              onClick={ handleToggleButton }>
                Subscribe To Socket
            </button> 
        }
      </div>
      <div>
        <br />
        {/* <button className="btn" onClick={ clickButton }>Click Me</button> */}
      </div>
    </PageBody>
  )
}

export default Home