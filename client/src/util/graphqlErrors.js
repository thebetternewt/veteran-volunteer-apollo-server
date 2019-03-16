import { Alert } from 'antd'
import React from 'react'

const graphQlErrors = error => {
  console.log('graphql errors:', error)

  return error.graphQLErrors.map(({ message }, i) => (
    <Alert key={i} message={message} type="error" closable />
  ))
}

export default graphQlErrors
