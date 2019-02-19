import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { client } from './src/apollo/client'

import checkToken from './src/util/checkToken'

import 'antd/dist/antd.less'

checkToken()

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
)
