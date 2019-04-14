import React from 'react'

const Summary = ({ form }) => {
  const { getFieldsValue } = form

  const fields = getFieldsValue()
  const { details } = fields

  const getKeys = obj =>
    Object.keys(obj).filter(key => typeof fields[key] !== 'object')

  console.log(getKeys(fields))

  return (
    <div>
      <h2>Summary</h2>
      {getKeys(fields).map(key => (
        <p key={key}>
          <strong>{key}:</strong> {fields[key]}
        </p>
      ))}
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
