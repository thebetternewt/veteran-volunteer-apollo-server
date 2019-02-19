import React from 'react'
import { Alert } from 'antd'

const graphQlErrors = error => {
  console.log('graphql errors:', error.graphQLErrors)

  return error.graphQLErrors.map(({ message }, i) => (
    <Alert key={i} message={message} type="error" closable />
  ))
}

export default graphQlErrors
