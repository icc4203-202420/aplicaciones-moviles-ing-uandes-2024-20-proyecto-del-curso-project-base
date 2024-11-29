const CustomInput = ({ field, form, ...props }) => {
  return (
    <div className="custom-input-container">
      <input {...field} {...props} className="custom-input" />
    </div>
  )
}

export default CustomInput