import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { client } from './src/apollo/client'

import 'antd/dist/antd.less'

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
)
