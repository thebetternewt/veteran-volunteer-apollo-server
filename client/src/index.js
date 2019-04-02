import 'antd/dist/antd.css'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import { client } from './apollo/client'
import App from './App'
import './index.css'
import * as serviceWorker from './serviceWorker'
import checkCookie from './util/checkCookie'

// checkToken()
checkCookie()

const app = (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

ReactDOM.render(app, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
