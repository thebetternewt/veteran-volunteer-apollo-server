import React from 'react'

const Summary = ({ form, location, needType }) => {
  const { getFieldsValue } = form

  const fields = getFieldsValue()
  const { title, details } = fields

  const getKeys = obj =>
    Object.keys(obj).filter(key => typeof fields[key] !== 'object')

  console.log(getKeys(fields))

  return (
    <div>
      <h2>Summary</h2>
      <p>
        <strong>Need Type:</strong> {needType.label}
      </p>
      <p>
        <strong>Title:</strong> {title}
      </p>
      <p>
        <strong>Address:</strong> {location.address}
      </p>

      <h3>Details:</h3>
      {getKeys(details).map(key => (
        <p key={key}>
          <strong>{key}:</strong> {details[key]}
        </p>
      ))}
    </div>
  )
}

export default Summary
