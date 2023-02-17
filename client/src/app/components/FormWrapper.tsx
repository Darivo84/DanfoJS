import './componentStyles.css'

const FormWrapper = ({ ...props }) => {
  return (
    <form onSubmit={ props.onSubmit }>
      <div className="formWrapper">
        { props.children }
      </div>
    </form>
  )
}

export default FormWrapper