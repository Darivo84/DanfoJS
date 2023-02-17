import { Fragment } from 'react'
import './componentStyles.css'

const Input = ({ ...props }) => {
  return (
    <Fragment>
      <input 
        className="formInputs"
        type="text" 
        name={ props.name }
        value={ props.value }
        placeholder={ props.placeholder }
        onChange={ props.onChange }
      />
    </Fragment>
  )
}

export default Input