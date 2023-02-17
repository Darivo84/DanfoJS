import './componentStyles.css'

const Buttons = ({ ...props }) => {
  return (
    <button 
      className="btn"
    >
      { props.buttonTitle }
    </button>
  )
}

export default Buttons